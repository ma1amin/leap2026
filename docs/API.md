# API Documentation

This document describes the API endpoints for the LEAP 2026 Directory.

## Base URL
```
/api
```

## Endpoints

### Companies

#### GET /api/companies
Get all companies with optional search, category, hall, and pagination.

**Query Parameters:**
- `search` (optional): Search query to filter companies by name or description
- `category` (optional): Filter by category (cybersecurity, ai, fintech, cloud, infrastructure, consulting, healthcare, education, retail, other)
- `hall` (optional): Filter by hall (H1, H2, H3, H4, H5, H1A)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of items per page (default: 20)

**Response:**
```json
{
  "companies": [
    {
      "id": "string",
      "name": "string",
      "nameAr": "string | null",
      "description": "string",
      "descriptionAr": "string | null",
      "category": "string | null",
      "website": "string | null",
      "email": "string | null",
      "phone": "string | null",
      "linkedin": "string | null",
      "twitter": "string | null",
      "instagram": "string | null",
      "booth": "string | null",
      "hall": "string | null",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 20,
    "totalPages": 1
  }
}
```

**Example:**
```bash
GET /api/companies
GET /api/companies?search=crowd
GET /api/companies?page=1&limit=10
```

#### GET /api/companies/[id]
Get a single company by ID.

**Parameters:**
- `id`: Company ID (path parameter)

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "nameAr": "string | null",
  "description": "string",
  "descriptionAr": "string | null",
  "category": "string | null",
  "website": "string | null",
  "email": "string | null",
  "phone": "string | null",
  "linkedin": "string | null",
  "twitter": "string | null",
  "instagram": "string | null",
  "booth": "string | null",
  "hall": "string | null",
  "createdAt": "string",
  "updatedAt": "string"
}
```

**Example:**
```bash
GET /api/companies/clx1234567890
```

#### PATCH /api/companies/[id]
Update a company's details.

**Parameters:**
- `id`: Company ID (path parameter)

**Request Body:**
```json
{
  "name": "string",
  "nameAr": "string",
  "description": "string",
  "descriptionAr": "string",
  "category": "string",
  "website": "string",
  "email": "string",
  "phone": "string",
  "linkedin": "string",
  "twitter": "string",
  "instagram": "string",
  "booth": "string",
  "hall": "string"
}
```

**Response:**
Returns the updated company object.

**Example:**
```bash
PATCH /api/companies/clx1234567890
Content-Type: application/json

{
  "email": "contact@example.com",
  "phone": "+1-234-567-8900"
}
```

### Export

#### GET /api/export/csv
Export companies as CSV.

**Query Parameters:**
- `ids` (optional): Comma-separated list of company IDs to export
- `category` (optional): Filter by category
- `hall` (optional): Filter by hall (H1, H2, H3, H4, H5, H1A)

**Response:**
CSV file with headers: Name, Name (Arabic), Description, Description (Arabic), Category, Website, Email, Phone, LinkedIn, Twitter, Instagram, Booth, Hall

**Example:**
```bash
GET /api/export/csv?hall=H1
```

#### GET /api/export/excel
Export companies as Excel (XLSX) file.

**Query Parameters:**
- `ids` (optional): Comma-separated list of company IDs to export
- `category` (optional): Filter by category
- `hall` (optional): Filter by hall (H1, H2, H3, H4, H5, H1A)

**Response:**
- Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
- Content-Disposition: attachment; filename="leap-companies.xlsx"

**Example:**
```bash
GET /api/export/excel?category=ai
```

#### GET /api/export/json
Export companies as JSON file.

**Query Parameters:**
- `ids` (optional): Comma-separated list of company IDs to export
- `category` (optional): Filter by category
- `hall` (optional): Filter by hall (H1, H2, H3, H4, H5, H1A)

**Response:**
- Content-Type: application/json
- Content-Disposition: attachment; filename="leap-companies.json"

**Example:**
```bash
GET /api/export/json
```

### Statistics

#### GET /api/stats
Get dashboard statistics.

**Response:**
```json
{
  "total": number,
  "withWebsites": number,
  "withEmail": number,
  "withPhone": number,
  "withSocial": number,
  "byCategory": {
    "cybersecurity": number,
    "ai": number,
    "fintech": number,
    "cloud": number,
    "infrastructure": number,
    "consulting": number,
    "healthcare": number,
    "education": number,
    "retail": number,
    "other": number
  },
  "byHall": {
    "H1": number,
    "H2": number,
    "H3": number,
    "H4": number,
    "H5": number,
    "H1A": number
  }
}
```

## Error Responses

All endpoints may return error responses:

**400 Bad Request:**
```json
{
  "error": "Invalid request parameters"
}
```

**404 Not Found:**
```json
{
  "error": "Company not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Failed to fetch companies"
}
```

## Data Model

### Company
```typescript
interface Company {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  category?: string;
  website?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  booth?: string;
  hall?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Usage Examples

### Fetch all companies
```javascript
const response = await fetch('/api/companies');
const data = await response.json();
console.log(data.companies);
```

### Search companies
```javascript
const response = await fetch('/api/companies?search=security');
const data = await response.json();
console.log(data.companies);
```

### Export to CSV
```javascript
const response = await fetch('/api/export/csv');
const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'leap-companies.csv';
a.click();
```

### Update company
```javascript
const response = await fetch('/api/companies/clx1234567890', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'new-email@example.com',
  }),
});
const company = await response.json();
console.log(company);
```
