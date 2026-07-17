# Des-Tec Project Custom Agent Instructions

These instructions are automatically loaded by the AI Studio Coding Agent to ensure consistent, stable, and secure development practices on the **Des-Tec** project.

## Core Directives

### 1. Stability & Safe Implementations
* **Incremental Changes Only**: Avoid complete replacement of components if only a subset of their functionality needs modification. Modify incrementally and surgically.
* **Pre-Modification Backups**: Before editing key components, review existing code, understand dependencies, and ensure a stable local recovery strategy.
* **Design & Appearance Preservation**: Never modify existing UI designs, color palettes, spacing, typography, or existing visual layouts unless explicitly requested. All optimizations and features must adapt seamlessly to the premium aesthetic.
* **Codebase Structure**: Maintain the established file organization and folders (e.g., modular components, specialized context providers, helper databases/utils).

### 2. High-Performance Constraints
* **Passive Listeners & Ref-Driven Animation**: Keep scroll and mouse listeners passive (`{ passive: true }`) and use React refs instead of local state for highly dynamic canvas or pointer tracking to avoid unnecessary component re-renders.
* **Single-Observer Spy**: Use a unified, multi-target `IntersectionObserver` in the top-level app rather than creating multiple observers inside child navigation/layout components.
* **Service Workers & Offline Architecture**: Protect offline PWA stability. Ensure offline forms are saved in IndexedDB and synchronized automatically once network connection is recovered.
