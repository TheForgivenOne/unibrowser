# Pyright Integration

unibrowser includes Python type stubs and a `pyrightconfig.json` for type-checking Python code that imports from unibrowser.

## Setup

The project includes:

```
pyrightconfig.json     # Pyright configuration
pyi/unibrowser/
├── __init__.py        # Empty package init
└── __init__.pyi       # Type stubs
```

## Configuration

`pyrightconfig.json`:

```json
{
  "include": ["pyi", "src"],
  "exclude": ["node_modules", "dist"],
  "typeCheckingMode": "strict",
  "reportMissingImports": true,
  "reportMissingTypeStubs": false,
  "stubPath": "pyi",
  "pythonVersion": "3.11",
  "pythonPlatform": "Linux"
}
```

## Running Pyright

```bash
npm run pyright
# or
npx pyright
```

## Stub Files

The `.pyi` files provide type hints for Python code that interacts with unibrowser. This is useful when:

- Writing Python test runners that shell out to unibrowser
- Using Python wrappers around the TypeScript package
- Building Python SDKs that mirror the unibrowser API

## TypeScript Strict Mode

unibrowser is built with strict TypeScript settings:

- `strict: true`
- `exactOptionalPropertyTypes: true`
- `noUncheckedIndexedAccess: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noImplicitReturns: true`

Run the TypeScript type checker:

```bash
npm run typecheck
```

Both TypeScript (`tsc`) and Pyright checks can be run independently:

```bash
npm run typecheck   # TypeScript
npm run pyright     # Python stubs
```
