let counter = 0;

function createId() {
  counter = (counter + 1) % Number.MAX_SAFE_INTEGER;
  return `loading-${Date.now()}-${counter}`;
}

function hasWindow() {
  return typeof window !== "undefined" && typeof window.dispatchEvent === "function";
}

export function emitLoadingStart(detail = {}) {
  if (!hasWindow()) return null;
  const id = detail.id || createId();
  const event = new CustomEvent("app-loading:start", {
    detail: {
      id,
      title: detail.title,
      message: detail.message,
      context: detail.context,
    },
  });
  window.dispatchEvent(event);
  return id;
}

export function emitLoadingEnd(id) {
  if (!hasWindow() || !id) return;
  const event = new CustomEvent("app-loading:end", { detail: { id } });
  window.dispatchEvent(event);
}
