#!/usr/bin/env node
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
let buffer = Buffer.alloc(0);

function send(message) {
  const payload = Buffer.from(JSON.stringify(message), 'utf8');
  process.stdout.write(`Content-Length: ${payload.byteLength}\r\n\r\n`);
  process.stdout.write(payload);
}

function textResult(text, isError = false) {
  return {
    content: [{ type: 'text', text }],
    isError,
  };
}

async function runCli(args) {
  const { stdout, stderr } = await execFileAsync('codex-hacksong', args, {
    timeout: 30000,
    maxBuffer: 1024 * 1024,
  });
  return [stdout, stderr].filter(Boolean).join('\n').trim();
}

const tools = [
  {
    name: 'hacksong_status',
    description: 'Check Hacksong server and local login status.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'hacksong_sync',
    description: 'Upload one manual Codex test turn and file event to Hacksong.',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: { type: 'string' },
        assistant: { type: 'string' },
      },
      additionalProperties: false,
    },
  },
];

async function handleRequest(request) {
  const { id, method, params } = request;

  if (method === 'initialize') {
    send({
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: params?.protocolVersion || '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'hacksong-local', version: '1.0.0' },
      },
    });
    return;
  }

  if (method === 'notifications/initialized') {
    return;
  }

  if (method === 'tools/list') {
    send({ jsonrpc: '2.0', id, result: { tools } });
    return;
  }

  if (method === 'tools/call') {
    try {
      const name = params?.name;
      const args = params?.arguments || {};
      if (name === 'hacksong_status') {
        send({ jsonrpc: '2.0', id, result: textResult(await runCli(['status'])) });
        return;
      }
      if (name === 'hacksong_sync') {
        const cliArgs = ['sync'];
        if (args.prompt) cliArgs.push('--prompt', String(args.prompt));
        if (args.assistant) cliArgs.push('--assistant', String(args.assistant));
        send({ jsonrpc: '2.0', id, result: textResult(await runCli(cliArgs)) });
        return;
      }
      throw new Error(`Unknown tool: ${name}`);
    } catch (error) {
      send({
        jsonrpc: '2.0',
        id,
        result: textResult(error instanceof Error ? error.message : String(error), true),
      });
    }
    return;
  }

  if (id !== undefined) {
    send({
      jsonrpc: '2.0',
      id,
      error: { code: -32601, message: `Method not found: ${method}` },
    });
  }
}

function processBuffer() {
  while (true) {
    const headerEnd = buffer.indexOf('\r\n\r\n');
    if (headerEnd < 0) return;

    const header = buffer.subarray(0, headerEnd).toString('utf8');
    const match = header.match(/Content-Length:\s*(\d+)/i);
    if (!match) {
      buffer = buffer.subarray(headerEnd + 4);
      continue;
    }

    const length = Number(match[1]);
    const messageStart = headerEnd + 4;
    const messageEnd = messageStart + length;
    if (buffer.byteLength < messageEnd) return;

    const raw = buffer.subarray(messageStart, messageEnd).toString('utf8');
    buffer = buffer.subarray(messageEnd);
    Promise.resolve()
      .then(() => handleRequest(JSON.parse(raw)))
      .catch((error) => console.error(error));
  }
}

process.stdin.on('data', (chunk) => {
  buffer = Buffer.concat([buffer, chunk]);
  processBuffer();
});
