# Gear Guard 🛡️

**Gear Guard** (formerly Team Up Care) is a comprehensive **Maintenance Management System (CMMS)** designed to streamline equipment tracking, maintenance requests, and workflow management for industrial and facility operations.

It bridges the gap between managers, technicians, and employees with a modern, real-time interface.


## 🚀 Key Features

### 👥 Role-Based Access Control
- **Managers:** Full oversight, asset management, technician assignment, and cost analysis.
- **Technicians:** Receive tasks, view checklists, log parts usage, and update status in real-time.
- **Employees:** Quickly report issues via scanning or manual entry without complex forms.

### 📷 Smart Scanning & Asset Management
- **Barcode/QR Scanner:** Integrated camera support to scan equipment tags for instant identification.
- **Asset Registry:** Track equipment details, warranty status, location, and history.
- **Search:** Global search across assets and requests by name or serial number.

### ⚡ Real-Time Workflow
- **Live Updates:** Status changes (New -> In Progress -> Repaired) are broadcasted instantly to all connected users via WebSockets.
- **Kanban Board:** Visual drag-and-drop interface for managing maintenance tickets (Manager/Technician view).
- **Notifications:** Instant toast notifications for task updates.

### 📊 Analytics & TCO
- **Dashboard:** High-level metrics on critical equipment, overdue tasks, and operational status.
- **Cost Tracking:** Calculate Total Cost of Ownership (TCO) based on labor hours and spare parts usage.
- **Trend Analysis:** Visual charts for corrective vs. preventive maintenance over time.

## 🛠️ Technology Stack

**Frontend:**
- **React 18** (Vite)
- **TypeScript**
- **Tailwind CSS** & **Shadcn/UI** (Styling)
- **Recharts** (Analytics)
- **Hello Pangea DnD** (Kanban)
- **ZXing** (Barcode Scanning)

**Backend:**
- **Python 3.10+**
- **FastAPI** (High-performance web framework)
- **SQLAlchemy** (ORM)
- **SQLite** (Default DB, easily scalable to PostgreSQL)
- **WebSockets** (Real-time events)

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Shyam-vadgama/gear-guard.git
cd gear-guard
```

### 2. Backend Setup
Navigate to the backend directory and set up the Python environment.

```bash
cd backend
python -m venv venv

# Activate Virtual Environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

# Install Dependencies
pip install -r requirements.txt

# Run Database Migrations / Seed Data (Optional)
python seed.py

# Start the Server
uvicorn app.main:app --reload
```
*The backend API will run at `http://localhost:8000`.*

### 3. Frontend Setup
Open a new terminal in the root directory.

```bash
# Install Dependencies
npm install

# Start Development Server
npm run dev
```
*The frontend will run at `http://localhost:5173`.*

## 📱 Usage

1. **Login:** Use the seeded credentials (check `backend/seed.py` or create a new user).
   - **Manager:** `manager@example.com`
   - **Technician:** `tech@example.com`
   - **Employee:** `employee@example.com`
2. **Dashboard:** Monitor system status.
3. **Equipment:** Add assets and print QR codes (simulated).
4. **Maintenance:** Drag and drop tickets to change status or open them to add parts/checklist items.
5. **Scanner:** Use the camera icon to scan equipment for quick requests.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
