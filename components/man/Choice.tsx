"use client";

import { useState } from "react";
import { Check } from "lucide-react";

/** Manaakhah-designed checkbox — replaces the native OS checkbox. Controlled or uncontrolled. */
export function Checkbox({
  checked, defaultChecked, onChange, label, className = "", disabled,
}: {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const [internal, setInternal] = useState(defaultChecked ?? false);
  const isControlled = checked !== undefined;
  const cur = isControlled ? checked : internal;
  const toggle = () => { const v = !cur; if (!isControlled) setInternal(v); onChange?.(v); };

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={cur}
      disabled={disabled}
      onClick={toggle}
      className={`inline-flex items-center gap-2 text-left disabled:opacity-50 ${className}`}
    >
      <span
        className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-[5px] transition-colors"
        style={cur
          ? { background: "var(--moss-700)", border: "1.5px solid var(--moss-700)" }
          : { background: "var(--card)", border: "1.5px solid var(--card-edge)" }}
      >
        {cur && <Check size={12} strokeWidth={3} style={{ color: "var(--bone)" }} />}
      </span>
      {label != null && <span className="t-body-sm" style={{ color: "var(--ink-700)" }}>{label}</span>}
    </button>
  );
}

/** Manaakhah-designed radio — replaces the native OS radio button. */
export function Radio({
  checked, onChange, label, className = "", disabled,
}: {
  checked: boolean;
  onChange: () => void;
  label?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`inline-flex items-center gap-2 text-left disabled:opacity-50 ${className}`}
    >
      <span
        className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full transition-colors"
        style={{ border: `1.5px solid ${checked ? "var(--moss-700)" : "var(--card-edge)"}`, background: "var(--card)" }}
      >
        {checked && <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--moss-700)" }} />}
      </span>
      {label != null && <span className="t-body-sm" style={{ color: "var(--ink-700)" }}>{label}</span>}
    </button>
  );
}
