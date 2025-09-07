import { Octokit } from 'octokit'

export function toBase64(str: string): string {
  const bytes = new TextEncoder().encode(str)
  const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join('')
  return btoa(binary)
}

export function fromBase64(base64: string): string {
  const binary = atob(base64)
  const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN!
})
