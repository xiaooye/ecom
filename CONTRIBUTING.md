# Contributing to WebStore

Thank you for your interest in contributing to WebStore!

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/ecom.git`
3. Install dependencies: `npm install`
4. Copy environment files:
   ```bash
   cp backend/.env.template backend/.env
   cp storefront/.env.template storefront/.env.local
   ```
5. Start development:
   ```bash
   npm run dev --workspace=backend
   npm run dev --workspace=storefront
   ```

## Project Structure

- `backend/` — Medusa.js v2 server (API, modules, subscribers)
- `storefront/` — Next.js 15 frontend (pages, components, stores)

## Code Style

- TypeScript strict mode
- Tailwind CSS for styling
- shadcn/ui for component primitives
- Framer Motion for animations
- Zustand for client state

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation
- `chore:` — Maintenance
- `refactor:` — Code restructuring

## Pull Requests

1. Create a feature branch: `git checkout -b feat/my-feature`
2. Make your changes
3. Run the build: `npm run build --workspace=storefront`
4. Commit with a descriptive message
5. Push and open a PR

## License

By contributing, you agree that your contributions will be licensed under the project's license.
