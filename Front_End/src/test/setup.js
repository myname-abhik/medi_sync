import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// jsdom has no scrollIntoView
window.HTMLElement.prototype.scrollIntoView = () => {};

afterEach(() => {
  cleanup();
});
