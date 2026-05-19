import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { randomUUID } from 'crypto';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

type TDocument = {
  id: string;
  title: string;
  type: string;
  format: string;
  filename: string;
  size: number;
  url: string;
  createdAt: string;
  preview: string;
};

const documents: TDocument[] = [
  {
    id: '1',
    title: 'Q1 Financial Report',
    type: 'report',
    format: 'pdf',
    filename: 'q1-financial-report.pdf',
    size: 450000,
    url: '/sample-documents/q1-financial-report.txt',
    createdAt: '2026-01-15T09:30:00Z',
    preview:
      'This report summarizes the financial performance for Q1 2026. Revenue increased 12% year-over-year, driven primarily by expansion in the enterprise segment. Operating expenses remained within budget targets, with notable investments in R&D and talent acquisition.',
  },
  {
    id: '2',
    title: 'Engineering Team Handbook',
    type: 'handbook',
    format: 'pdf',
    filename: 'engineering-handbook.pdf',
    size: 1200000,
    url: '/sample-documents/engineering-handbook.txt',
    createdAt: '2026-02-20T14:15:00Z',
    preview:
      'Welcome to the Engineering Team Handbook. This document covers our development practices, code review standards, on-call rotation policies, and team norms. All new engineers should read this during their first week and discuss any questions with their onboarding buddy.',
  },
  {
    id: '3',
    title: 'PTO Policy 2026',
    type: 'policy',
    format: 'pdf',
    filename: 'pto-policy.pdf',
    size: 180000,
    url: '/sample-documents/pto-policy.txt',
    createdAt: '2026-03-05T11:00:00Z',
    preview:
      'Cascade provides unlimited paid time off for all full-time employees. We trust our team members to manage their time responsibly while meeting their commitments. Employees are encouraged to take a minimum of 15 days per year. All PTO requests should be submitted at least two weeks in advance.',
  },
  {
    id: '4',
    title: 'Onboarding Checklist',
    type: 'checklist',
    format: 'docx',
    filename: 'onboarding-checklist.docx',
    size: 95000,
    url: '/sample-documents/onboarding-checklist.txt',
    createdAt: '2026-03-18T16:45:00Z',
    preview:
      'New hire onboarding checklist — Day 1: Complete I-9 verification, set up laptop and accounts, meet your manager and buddy. Week 1: Attend orientation sessions, review team handbook, complete compliance training. Week 2: Shadow team members, set up development environment, submit first PR.',
  },
  {
    id: '5',
    title: 'Architecture Decision Record - Auth',
    type: 'adr',
    format: 'md',
    filename: 'auth-adr.md',
    size: 12000,
    url: '/sample-documents/auth-adr.txt',
    createdAt: '2026-04-02T08:20:00Z',
    preview:
      'ADR-007: Authentication Architecture. Status: Accepted. Context: We need a unified authentication system that supports SSO, MFA, and session management across all Cascade applications. Decision: Adopt Firebase Authentication with custom claims for role-based access control.',
  },
];

// GET /api/documents — list with optional filters
app.get('/api/documents', (req, res) => {
  let result = [...documents];

  const q = req.query.q as string | undefined;
  if (q) {
    const term = q.toLowerCase();
    result = result.filter((doc) => doc.title.toLowerCase().includes(term));
  }

  const type = req.query.type as string | undefined;
  if (type) {
    result = result.filter(
      (doc) => doc.type.toLowerCase() === type.toLowerCase()
    );
  }

  res.json(result);
});

// GET /api/documents/:id
app.get('/api/documents/:id', (req, res) => {
  const document = documents.find((doc) => doc.id === req.params.id);
  if (!document) {
    res.status(404).json({ error: 'Document not found' });
    return;
  }
  res.json(document);
});

// POST /api/documents — upload with simulated progress
// The upload is accepted via multipart form data.
// Progress is simulated server-side with chunked transfer encoding.
app.post('/api/documents', upload.single('file'), (req, res) => {
  const file = req.file;
  const title = req.body.title as string;
  const type = req.body.type as string;

  if (!file) {
    res.status(400).json({ error: 'No file provided' });
    return;
  }

  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }

  // Simulate upload processing delay (1-3 seconds)
  const delay = 1000 + Math.random() * 2000;

  setTimeout(() => {
    const ext = file.originalname.split('.').pop() || 'pdf';
    const newDocument: TDocument = {
      id: randomUUID(),
      title,
      type: type || 'other',
      format: ext,
      filename: file.originalname,
      size: file.size,
      url: `/sample-documents/${file.originalname}`,
      createdAt: new Date().toISOString(),
      preview: `Uploaded document: ${title}. This is a ${ext.toUpperCase()} file containing ${file.size} bytes.`,
    };

    documents.push(newDocument);
    res.status(201).json(newDocument);
  }, delay);
});

// DELETE /api/documents/:id
// ~20% chance of failure to test optimistic rollback
app.delete('/api/documents/:id', (req, res) => {
  const index = documents.findIndex((doc) => doc.id === req.params.id);

  if (index === -1) {
    res.status(404).json({ error: 'Document not found' });
    return;
  }

  // Simulate occasional failure
  if (Math.random() < 0.2) {
    res
      .status(500)
      .json({
        error: 'Server error: could not delete document. Please try again.',
      });
    return;
  }

  // Simulate network delay
  setTimeout(() => {
    documents.splice(index, 1);
    res.status(204).send();
  }, 500 + Math.random() * 1000);
});

// GET /api/types — list unique document types
app.get('/api/types', (_req, res) => {
  const allTypes = [...new Set(documents.map((doc) => doc.type))].sort();
  res.json(allTypes);
});

app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
  console.log(`\nEndpoints:`);
  console.log(
    `  GET    /api/documents       — list documents (query: ?q=search&type=report)`
  );
  console.log(`  GET    /api/documents/:id   — get single document`);
  console.log(
    `  POST   /api/documents       — upload (multipart: file, title, type)`
  );
  console.log(
    `  DELETE /api/documents/:id    — delete (~20% simulated failure rate)`
  );
  console.log(`  GET    /api/types           — list unique document types`);
});
