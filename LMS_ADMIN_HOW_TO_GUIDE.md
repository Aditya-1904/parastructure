# 🚀 Parastructure LMS: Official Administrator & Faculty How-To Guide

Welcome to the **Parastructure Learning Management System (LMS)** Administrator Manual. This guide provides step-by-step instructions for managing your engineering courses, bulk importing curriculum schedules, building automated MCQ assignments, grading student submissions, and streamlining daily lecture operations.

---

## 📑 Table of Contents
1. [Course Creation & Catalog Management](#1-course-creation--catalog-management)
2. [Managing Curriculum & Modules (Manual vs. Bulk Import)](#2-managing-curriculum--modules-manual-vs-bulk-import)
3. [The 5-Second Post-Lecture Recording Routine](#3-the-5-second-post-lecture-recording-routine)
4. [Creating & Managing MCQ Assignments](#4-creating--managing-mcq-assignments)
5. [Grading & Reviewing Student Submissions](#5-grading--reviewing-student-submissions)
6. [Managing Enrollments & Student Access](#6-managing-enrollments--student-access)
7. [Pro-Tip: Using AI to Generate Course JSON from Excel](#7-pro-tip-using-ai-to-generate-course-json-from-excel)

---

## 1. Course Creation & Catalog Management
The **Course Creator** is where you launch new engineering programs, set pricing (including EMI options), define badges, and manage visibility.

### How to Create or Edit a Course:
1. Navigate to **Course Creator** in the left Admin Sidebar (`/admin/courses`).
2. Fill out the **Create New Course** form:
   - **Course Title:** Full name (e.g., *Advanced Bridge Engineering & Analysis*).
   - **Course ID / Slug:** Unique identifier used in URLs (e.g., `bridge-design-101`). *Leave blank to auto-generate.*
   - **Selling Price & Original Price:** Selling price is what students pay; original price shows as a strikethrough for discounts.
   - **EMI Option:** Check **Enable EMI Option** and set the monthly installment amount if you wish to offer split payments.
   - **Badges:** Check **Bestseller Badge** or **Job Assistance Badge** to display glowing highlights on the course card.
   - **Publish Status:** Set to **Published (Visible on site)** when ready for students to enroll, or **Draft / Hidden** while building.
3. Click **"+ Create Course"** (or **"Save Changes"** if editing). The catalog updates instantly across the entire platform.

---

## 2. Managing Curriculum & Modules (Manual vs. Bulk Import)
Once a course is created, you add learning modules (Lectures or Assignments) in **Course Content** (`/admin/content`). You can do this one-by-one or in bulk using JSON.

### Method A: Course-Scoped Bulk Import (Recommended ⚡)
Use this method when adding multiple upcoming lectures or updating existing schedules in seconds.

1. Navigate to **Course Content** (`/admin/content`) and click the top tab for your target course (e.g., **PSC** or **Bridge Pro Track**).
2. Click the gold button: **⚡ Bulk Import Modules (JSON / Paste)** right above the form.
3. Paste a JSON array of your upcoming classes into the text area.
4. **Automatic Segregation:** You do *not* need to specify course IDs in your JSON; the system automatically locks the import to whatever course tab you have selected!

#### Standard Bulk Import Template:
```json
[
  {
    "title": "Module 1: Introduction to Bridge Superstructures",
    "type": "lecture",
    "date_string": "10 Aug | 8:00pm",
    "status": "auto",
    "meeting_link": "https://zoom.us/j/your_live_room_link"
  },
  {
    "title": "Module 2: Grillage Analysis in MIDAS Civil",
    "type": "lecture",
    "date_string": "12 Aug | 8:00pm",
    "status": "auto",
    "meeting_link": "https://zoom.us/j/your_live_room_link"
  },
  {
    "title": "Module 3: Superstructure Design Assignment",
    "type": "assignment",
    "date_string": "15 Aug | 6:00pm",
    "status": "auto"
  }
]
```

> [!TIP]
> **Why use `"status": "auto"`?**  
> When you set `"status": "auto"`, our Automated Access Resolver evaluates access dynamically:
> - If a `meeting_link` is present and no recording exists, it automatically displays as **`🔓 Upcoming / Live`** and triggers the glowing **🔴 Live Session Active** banner on the student dashboard!
> - When you attach a `recording_link` after class, it automatically converts to **`✔️ Completed`** and unlocks the replay player!

#### How Appending vs. Updating Works:
- **New Modules:** Any title that doesn't exist in the course yet will be cleanly appended in chronological order below your existing lectures.
- **Existing Modules (Exact Title Match):** If you import a module with the *exact same title* as an existing lecture, the system will **update/edit** that lecture (e.g., adding recording links or changing dates) instead of creating a duplicate!

---

## 3. The 5-Second Post-Lecture Recording Routine
When your live webinar or Zoom lecture concludes, follow this 5-second routine to publish the replay video and downloadable PDF notes to all enrolled students:

1. Copy your YouTube / Zoom Cloud recording URL (and upload any PDF notes to Google Drive or Supabase Storage).
2. Go to **Course Content** (`/admin/content`), select your course tab, and click **⚡ Bulk Import Modules**.
3. Paste a simple 3-line JSON matching the exact title of the lecture you just taught:
```json
[
  {
    "title": "Module 1: Introduction to Bridge Superstructures",
    "recording_link": "https://youtube.com/watch?v=your_video_id",
    "resource_link": "https://drive.google.com/file/d/your_pdf_notes/view"
  }
]
```
4. Click **Confirm & Import**.
5. *Done!* The system matches the title, injects the video and notes, automatically marks the lecture as **`✔️ Completed`**, and moves it to the "Previous Recordings" library in the student classroom.

---

## 4. Creating & Managing MCQ Assignments
Assignments allow you to test student knowledge with interactive Multiple Choice Questions (MCQs).

### Step-by-Step Assignment Setup:
1. In **Course Content**, add a module (manually or via JSON) with `"type": "assignment"`.
2. In the module table below, an assignment module will display a gold button: **"⚙️ Manage Quiz"**. Click it.
3. In the Quiz Builder (`/admin/content/quiz`):
   - Type your question in **Question Text** (e.g., *What is the primary function of shear studs in composite bridges?*).
   - Enter between 2 and 4 answer options in Option A, B, C, and D.
   - Select the **Correct Option Index** radio button (`0` for Option A, `1` for Option B, `2` for Option C, `3` for Option D).
4. Click **"+ Add Question"**. Students will immediately see the updated interactive quiz when they click that assignment in their classroom!

---

## 5. Grading & Reviewing Student Submissions
The **Assignments & Grades** hub (`/admin/submissions`) is your command center for evaluating student quiz performance and monitoring class completion rates.

### How to Evaluate Submissions:
1. Click **Assignments & Grades** (🎯 icon) in the Admin Sidebar.
2. Select your course using the top navigation pills.
3. For each assignment module, review the **Metrics Ribbon**:
   - **Enrolled Students:** Total active students in the course.
   - **Submissions Received:** Total quizzes submitted.
   - **Pending Attempts:** Number of enrolled students who haven't taken the quiz yet.
   - **Class Average Score:** Overall class pass percentage.
4. **Student Grades Table:**
   - See each student's Name, Email, Submission Date, Score (e.g., `4 / 5`), and percentage badge (`Excellent` ≥80%, `Satisfactory` ≥50%, `Needs Focus` <50%).
   - **View Answer Sheet:** Click the interactive **"View Answer Sheet"** expander on any student's row to inspect their exact answers question-by-question, highlighted in green (correct ✓) or red (incorrect ✗ with correct answer shown).
5. **Pending Attempts List:** At the bottom of each assignment card, view a pill list of all enrolled students who have not yet submitted, making it easy to send reminder emails or follow up!

---

## 6. Managing Enrollments & Student Access
The **Enrollments** page (`/admin/enrollments`) allows you to grant or revoke course access for any registered user.

### How to Grant Course Access:
1. Go to **Enrollments** (`/admin/enrollments`).
2. In the **Manual Enrollment / Override** box:
   - Select the **User** from the dropdown (shows real names and emails fetched from Clerk).
   - Select the **Target Course**.
   - Select **Status** (`Active`, `Completed`, or `Cancelled`).
   - Enter **Amount Paid (₹)** (e.g., `59999` or `0` for complimentary scholarship access).
3. Click **"Enroll / Update Student"**. The student will immediately gain full classroom access on their dashboard!

---

## 7. Pro-Tip: Using AI to Generate Course JSON from Excel
You or your faculty do not need to format JSON manually! You can copy any table from Excel, Google Sheets, or a text document and paste it into **ChatGPT**, **Claude**, or **Gemini** with the following prompt:

#### 🤖 Copy-Paste AI Prompt:
> *"I am an administrator for an engineering LMS. Please convert the following table/list of lectures into a JSON array formatted for our Bulk Importer.  
> Rules:  
> 1. Each object must have `title` (string), `type` (either 'lecture' or 'assignment'), `date_string` (e.g. '15 Aug | 8:00pm'), and `"status": "auto"`.  
> 2. If a meeting link or recording link is provided in my text, include it as `meeting_link` or `recording_link`.  
> 3. If an item is an assignment with questions, nest an array of `questions` where each question has `question_text`, an array of 4 strings in `options`, and integer `correct_option_index` (0 to 3).  
> Here is my schedule data: [PASTE YOUR EXCEL OR TEXT SCHEDULE HERE]"*

Once the AI generates the clean JSON array, simply copy it and paste it into the **⚡ Bulk Import Modules** box in your Admin Panel!
