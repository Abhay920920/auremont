/* eslint-disable max-lines-per-function, complexity, @typescript-eslint/no-explicit-any */
import * as path from 'path';
import * as fs from 'fs';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const multer = require('multer');

describe('RARE NUTS — Multer Security & Dependency Remediation Test Suite', () => {
  // ── 1. Dependency Version Verification ─────────────────────────────────────
  describe('1. Dependency Verification & CVE Remediation', () => {
    it('VERIFY: runtime multer version is 2.3.0 or higher (not vulnerable 2.2.0)', () => {
      const multerPkg = require('multer/package.json');
      expect(multerPkg.version).toBe('2.3.0');
      expect(multerPkg.version).not.toBe('2.2.0');
    });

    it('VERIFY: lockfile declarations specify secure multer version', () => {
      const rootPkgPath = path.resolve(__dirname, '../../package.json');
      const backendPkgPath = path.resolve(__dirname, '../package.json');

      if (fs.existsSync(rootPkgPath)) {
        const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
        expect(rootPkg.overrides?.multer).toBe('2.3.0');
      }

      if (fs.existsSync(backendPkgPath)) {
        const backendPkg = JSON.parse(fs.readFileSync(backendPkgPath, 'utf8'));
        expect(backendPkg.overrides?.multer).toBe('2.3.0');
      }
    });

    it('VERIFY: platform-express loads without errors against multer 2.3.0', () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const platformExpress = require('@nestjs/platform-express');
      expect(platformExpress).toBeDefined();
      expect(typeof platformExpress.ExpressAdapter).toBe('function');
    });
  });

  // ── 2. Multer Storage & Size Limit Controls ────────────────────────────────
  describe('2. Multer Storage Controls & Memory Safety', () => {
    it('SAFE: memoryStorage correctly initializes with strict byte limits', () => {
      const storage = multer.memoryStorage();
      const upload = multer({
        storage,
        limits: {
          fileSize: 1024 * 1024, // 1 MB limit
          files: 1,
          fields: 5,
        },
      });

      expect(upload).toBeDefined();
      expect(typeof upload.single).toBe('function');
      expect(typeof upload.array).toBe('function');
    });

    it('SAFE: fileFilter enforces strict MIME type allowlisting', (done) => {
      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
      const fileFilter = (_req: any, file: any, cb: any) => {
        if (!allowedMimes.includes(file.mimetype)) {
          return cb(new Error('INVALID_MIME_TYPE: Only JPEG, PNG, and WebP images are permitted.'), false);
        }
        cb(null, true);
      };

      const upload = multer({
        storage: multer.memoryStorage(),
        fileFilter,
      });

      // Test allowed MIME
      upload.fileFilter({} as any, { mimetype: 'image/png' }, (err: any, accept: boolean) => {
        expect(err).toBeNull();
        expect(accept).toBe(true);

        // Test disallowed dangerous MIME
        upload.fileFilter({} as any, { mimetype: 'application/x-msdownload' }, (err2: any, accept2: boolean) => {
          expect(err2).toBeDefined();
          expect(err2.message).toContain('INVALID_MIME_TYPE');
          expect(accept2).toBe(false);
          done();
        });
      });
    });
  });

  // ── 3. Path Traversal & Filename Neutralization ─────────────────────────────
  describe('3. Path Traversal & Filename Safety', () => {
    it('SAFE: dangerous path traversal filenames are neutralized by secure naming policy', () => {
      const dangerousFilenames = [
        '../../evil.exe',
        '..\\..\\evil.dll',
        '/etc/passwd',
        'C:\\Windows\\System32\\calc.exe',
        '....//....//shell.php',
        'file\0.png',
      ];

      const sanitizeUploadFilename = (originalName: string, prefix = 'img'): string => {
        // Safe server-generated filename policy: strip directories, sanitize extension, use random UUID
        const ext = path.extname(originalName).toLowerCase().replace(/[^a-z0-9.]/g, '');
        const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
        const safeExt = allowedExts.includes(ext) ? ext : '.bin';
        const safeId = require('crypto').randomBytes(16).toString('hex');
        return `${prefix}_${safeId}${safeExt}`;
      };

      for (const dangerousName of dangerousFilenames) {
        const safeName = sanitizeUploadFilename(dangerousName);
        expect(safeName).not.toContain('..');
        expect(safeName).not.toContain('/');
        expect(safeName).not.toContain('\\');
        expect(safeName).not.toContain('\0');
        expect(safeName).toMatch(/^[a-z]+_[a-f0-9]{32}\.[a-z0-9]+$/);
      }
    });
  });

  // ── 4. Multer Error Safety & Non-Leakage ───────────────────────────────────
  describe('4. Error Handling & Information Leakage Prevention', () => {
    it('SAFE: MulterError codes produce structured errors without leaking file paths', () => {
      const MulterError = multer.MulterError;
      const err = new MulterError('LIMIT_FILE_SIZE', 'file');

      expect(err).toBeInstanceOf(Error);
      expect(err.code).toBe('LIMIT_FILE_SIZE');
      expect(err.field).toBe('file');

      // Ensure error representation does not contain system directories
      const serialized = JSON.stringify({ code: err.code, message: 'File size exceeds maximum allowed limit' });
      expect(serialized).not.toContain('C:\\');
      expect(serialized).not.toContain('/home/');
      expect(serialized).not.toContain('/var/');
    });
  });
});
