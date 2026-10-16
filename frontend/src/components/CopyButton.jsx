import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useToast } from './Toast.jsx';

// navigator.clipboard only exists on HTTPS or localhost, so plain HTTP falls back to execCommand.
async function copyText(text) {
  if (navigator.clipboard) return navigator.clipboard.writeText(text);
  const area = document.createElement('textarea');
  area.value = text;
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  const ok = document.execCommand('copy');
  area.remove();
  if (!ok) throw new Error('Copy failed');
}

export function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const showToast = useToast();

  async function handleCopy() {
    try {
      await copyText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      showToast('Could not copy to the clipboard');
    }
  }

  const Icon = copied ? Check : Copy;
  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
      className="focus-ring rounded p-1 text-zinc-400 transition-colors duration-150 hover:text-zinc-700 dark:hover:text-zinc-200"
    >
      <Icon aria-hidden className={`h-3.5 w-3.5 ${copied ? 'text-emerald-500' : ''}`} />
    </button>
  );
}
