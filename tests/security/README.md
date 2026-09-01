# Security Test Suite

This folder contains automated **adversarial security tests** for the RARE NUTS application. Run the suite with:

```bash
npm run test:security
```

The tests use **SuperTest** against a NestJS application bootstrapped in `setup.ts`. Helper functions for JWT generation and fixture data are provided in `fixtures.ts`.

Each spec file targets a specific threat vector described in the implementation plan. All tests assert that malicious actions are rejected (e.g., `403 Forbidden`, `409 Conflict`).
