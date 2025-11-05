# Code Smells Dashboard - Workshop Polish Task List

**Objective:** Polish the Code Smells Dashboard and integrate it with the AI-Assisted Engineering Workshop materials.

**Estimated Time:** 2-3 hours

**Target:** Ready for Session 1 participants as an interactive learning tool

---

## 📋 Overview

**What This Dashboard Provides:**
- Interactive reference for all code smells taught in Session 1
- Side-by-side bad vs. good code comparisons
- Search functionality for quick lookup
- Random smell generator for practice
- Progress tracking (mark as learned)
- Mobile-responsive design

**How It Fits the Workshop:**
- Complements the 4 Claude Code Skills
- Visual reference during demos (Part 2)
- Post-workshop study tool
- Shareable with team
- Works offline if downloaded

---

## ✅ Task Checklist

### Phase 1: Branding & Identity (30 min)

#### Update Site Title and Metadata

**File:** `index.html`

- [ ] **Update page title** (line ~6)
  ```html
  <!-- BEFORE -->
  <title>Code Smells Reference - Martin Fowler</title>

  <!-- AFTER -->
  <title>Code Smells Reference - ShippyPro Engineering Workshop</title>
  ```

- [ ] **Add meta description**
  ```html
  <!-- Add after line 5 -->
  <meta name="description" content="Interactive code smells reference from ShippyPro's AI-Assisted Engineering Workshop. Learn to recognize and fix code smells with real examples.">
  <meta name="author" content="ShippyPro Engineering">
  ```

#### Update Sidebar Header

**File:** `index.html`

- [ ] **Update sidebar title** (line ~24-25)
  ```html
  <!-- BEFORE -->
  <h1>Code Smells</h1>
  <p class="subtitle">Martin Fowler's Catalog</p>

  <!-- AFTER -->
  <h1>Code Smells</h1>
  <p class="subtitle">ShippyPro Engineering Workshop</p>
  <p class="subtitle-small">Based on Martin Fowler's Catalog</p>
  ```

- [ ] **Add subtitle-small style** to `style.css`
  ```css
  /* Add after .subtitle style */
  .subtitle-small {
    color: var(--color-text-secondary);
    font-size: 0.8rem;
    margin-top: 0.25rem;
    font-style: italic;
  }
  ```

#### Add Workshop Links to Footer

**File:** `index.html`

- [ ] **Add workshop links before stats** (around line 47)
  ```html
  <!-- Add BEFORE <div class="stats"> -->
  <div class="workshop-links">
    <a href="https://github.com/ShippyPro/refactoring-workshop-skills"
       target="_blank"
       class="workshop-link">
      📦 Workshop Materials
    </a>
    <a href="https://github.com/ShippyPro/refactoring-workshop-skills/blob/main/docs/Workshop-Skills-Usage-Guide.md"
       target="_blank"
       class="workshop-link">
      📖 Skills Guide
    </a>
    <a href="https://github.com/ShippyPro/refactoring-workshop-skills"
       target="_blank"
       class="workshop-link">
      💬 Questions? Create an Issue
    </a>
  </div>
  ```

- [ ] **Style workshop links** in `style.css`
  ```css
  /* Add to sidebar footer styles */
  .workshop-links {
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: var(--color-bg-secondary);
    border-radius: 8px;
    border-left: 3px solid var(--color-primary);
  }

  .workshop-link {
    display: block;
    color: var(--color-text-primary);
    text-decoration: none;
    padding: 0.5rem 0;
    font-size: 0.9rem;
    transition: color 0.2s;
  }

  .workshop-link:hover {
    color: var(--color-primary);
    padding-left: 0.5rem;
  }
  ```

---

### Phase 2: Content Alignment (45 min)

#### Verify Workshop Smells Coverage

**File:** `app.js`

- [ ] **Check all Session 1 smells are present:**

  **Bloaters (should have 5):**
  - [ ] Long Method ✓
  - [ ] Large Class ✓
  - [ ] Long Parameter List ✓
  - [ ] Data Clumps ✓
  - [ ] Primitive Obsession ✓

  **Couplers (should have 3):**
  - [ ] Feature Envy ✓
  - [ ] Message Chains ✓
  - [ ] Middle Man ✓

  **Dispensables (should have 3):**
  - [ ] Duplicate Code ✓
  - [ ] Dead Code ✓
  - [ ] Speculative Generality ✓

#### Highlight Workshop Smells

**File:** `app.js`

- [ ] **Add workshop flag to Session 1 smells**

  Find each of the 11 smells above and add:
  ```javascript
  // Example for Long Method:
  {
    name: 'Long Method',
    category: 'bloaters',
    brief: '...',
    workshop: true,  // ADD THIS LINE
    sessionCovered: 1,  // ADD THIS LINE
    // ... rest of smell
  }
  ```

  **Smells to update:**
  - Long Method
  - Large Class
  - Long Parameter List
  - Data Clumps
  - Primitive Obsession
  - Feature Envy
  - Message Chains
  - Middle Man
  - Duplicate Code
  - Dead Code
  - Speculative Generality

- [ ] **Add workshop badge to display**

  In `displaySmell()` function, after the category badge (around line ~550):
  ```javascript
  // Find this section:
  <div class="badge badge--${smell.category || 'default'}">${categoryLabel}</div>

  // Add after it:
  ${smell.workshop ? '<div class="badge badge--workshop">📚 Session 1</div>' : ''}
  ```

- [ ] **Style workshop badge** in `style.css`
  ```css
  /* Add to badge styles */
  .badge--workshop {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-weight: 600;
  }
  ```

#### Add "Workshop Smells" Tab

**File:** `index.html`

- [ ] **Add third tab** (around line 33)
  ```html
  <div class="tabs">
    <button class="tab-btn active" data-tab="general">General</button>
    <button class="tab-btn" data-tab="lambda">AWS Lambda</button>
    <button class="tab-btn" data-tab="workshop">Workshop</button>  <!-- ADD THIS -->
  </div>
  ```

**File:** `app.js`

- [ ] **Add workshop filter logic**

  Find `switchTab()` function (around line 100) and update:
  ```javascript
  function switchTab(tab) {
    currentTab = tab;

    // Update active button
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    // Render appropriate content
    if (tab === 'workshop') {
      renderWorkshopSmells();  // ADD THIS
    } else {
      renderSidebar();
    }
  }
  ```

- [ ] **Add renderWorkshopSmells() function**

  Add after `renderSidebar()` function (around line 200):
  ```javascript
  function renderWorkshopSmells() {
    const nav = document.getElementById('sidebarNav');

    // Collect all workshop smells
    const workshopSmells = [];

    // From general smells
    Object.values(codeSmells.general).forEach(category => {
      category.forEach(smell => {
        if (smell.workshop) {
          workshopSmells.push(smell);
        }
      });
    });

    // Sort by session and category
    workshopSmells.sort((a, b) => {
      if (a.sessionCovered !== b.sessionCovered) {
        return a.sessionCovered - b.sessionCovered;
      }
      return a.name.localeCompare(b.name);
    });

    // Render
    let html = `
      <div class="category">
        <div class="category-header">
          <h3>Session 1 Code Smells</h3>
          <span class="category-count">${workshopSmells.length}</span>
        </div>
        <ul class="smell-list">
    `;

    workshopSmells.forEach(smell => {
      const isLearned = learnedSmells.includes(smell.name);
      html += `
        <li class="smell-item ${currentSmell?.name === smell.name ? 'active' : ''} ${isLearned ? 'learned' : ''}"
            onclick="displaySmell(${JSON.stringify(smell).replace(/"/g, '&quot;')})">
          ${smell.name}
          ${isLearned ? '<span class="learned-check">✓</span>' : ''}
        </li>
      `;
    });

    html += '</ul></div>';
    nav.innerHTML = html;

    // Update total count
    updateStats(workshopSmells.length);
  }
  ```

#### Update Code Examples with Metrics

**File:** `app.js`

- [ ] **Add complexity metrics to examples**

  For the main workshop smells, update code examples to show metrics:

  **Example for Long Method:**
  ```javascript
  pythonBad: `# BAD: Long Method (87 lines, complexity: 18)
  def process_order(order_data):
      # Validation logic (20 lines)
      if not order_data:
          raise ValueError("Missing order data")
      ...
  `,

  pythonGood: `# GOOD: Extracted methods (complexity: 4)
  def process_order(order_data):
      validate_order(order_data)
      price = calculate_price(order_data)
      process_payment(price)
      send_notifications(order_data)
  `
  ```

  **Update these smells with metrics:**
  - [ ] Long Method
  - [ ] Large Class
  - [ ] Primitive Obsession
  - [ ] Feature Envy
  - [ ] Duplicate Code

---

### Phase 3: UX Improvements (30 min)

#### Add LocalStorage Persistence

**File:** `app.js`

- [ ] **Save learned smells to localStorage**

  Find `toggleLearned()` function and update:
  ```javascript
  function toggleLearned(smellName) {
    const index = learnedSmells.indexOf(smellName);
    if (index > -1) {
      learnedSmells.splice(index, 1);
    } else {
      learnedSmells.push(smellName);
    }

    // ADD THIS: Save to localStorage
    localStorage.setItem('learnedSmells', JSON.stringify(learnedSmells));

    renderSidebar();
    if (currentSmell) {
      displaySmell(currentSmell);
    }
  }
  ```

- [ ] **Load learned smells on init**

  Find initialization code (around line 50) and update:
  ```javascript
  // BEFORE
  let learnedSmells = [];

  // AFTER
  let learnedSmells = JSON.parse(localStorage.getItem('learnedSmells') || '[]');
  ```

#### Add "Reset Progress" Button

**File:** `index.html`

- [ ] **Add reset button to sidebar footer** (after stats)
  ```html
  <!-- Add after stats div, before closing sidebar-footer -->
  <button class="btn btn--link btn--sm btn--full-width"
          id="resetProgressBtn"
          title="Clear all learned smells">
    🔄 Reset Progress
  </button>
  ```

**File:** `app.js`

- [ ] **Add reset functionality**

  Add at the end of initialization (around line 700):
  ```javascript
  // Reset progress button
  document.getElementById('resetProgressBtn')?.addEventListener('click', () => {
    if (confirm('Clear all learned smells? This cannot be undone.')) {
      learnedSmells = [];
      localStorage.removeItem('learnedSmells');
      renderSidebar();
      if (currentSmell) {
        displaySmell(currentSmell);
      }
    }
  });
  ```

#### Add Keyboard Shortcuts

**File:** `app.js`

- [ ] **Add keyboard navigation**

  Add at the end of file:
  ```javascript
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Random smell: R key
    if (e.key === 'r' || e.key === 'R') {
      if (!e.target.matches('input, textarea')) {
        document.getElementById('randomBtn').click();
      }
    }

    // Search: / key
    if (e.key === '/') {
      e.preventDefault();
      document.getElementById('searchInput').focus();
    }

    // Mark as learned: L key
    if (e.key === 'l' || e.key === 'L') {
      if (!e.target.matches('input, textarea') && currentSmell) {
        toggleLearned(currentSmell.name);
      }
    }
  });
  ```

- [ ] **Add keyboard shortcuts hint**

  In `index.html`, add to sidebar footer:
  ```html
  <div class="keyboard-hints">
    <small>
      Shortcuts: <kbd>R</kbd> Random · <kbd>/</kbd> Search · <kbd>L</kbd> Mark Learned
    </small>
  </div>
  ```

- [ ] **Style keyboard hints** in `style.css`
  ```css
  .keyboard-hints {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border);
    text-align: center;
  }

  .keyboard-hints small {
    color: var(--color-text-secondary);
    font-size: 0.75rem;
  }

  kbd {
    background: var(--color-bg-tertiary);
    border: 1px solid var(--color-border);
    border-radius: 3px;
    padding: 0.1rem 0.3rem;
    font-family: monospace;
    font-size: 0.85em;
  }
  ```

#### Add Share Feature

**File:** `index.html`

- [ ] **Add share button to main content**

  In the detail view, add share button (around line 70, in main content area):
  ```html
  <!-- Add after smell title -->
  <button class="btn btn--secondary btn--sm" id="shareBtn" title="Share this smell">
    🔗 Share
  </button>
  ```

**File:** `app.js`

- [ ] **Add share functionality**

  In `displaySmell()` function, add at the end:
  ```javascript
  // Share button
  document.getElementById('shareBtn')?.addEventListener('click', () => {
    const url = `${window.location.origin}${window.location.pathname}#${smell.name.toLowerCase().replace(/\s+/g, '-')}`;

    if (navigator.share) {
      navigator.share({
        title: `Code Smell: ${smell.name}`,
        text: smell.brief,
        url: url
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
      });
    }
  });
  ```

- [ ] **Add URL hash handling**

  Add at initialization:
  ```javascript
  // Handle URL hash on load
  window.addEventListener('load', () => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const smellName = hash.replace(/-/g, ' ');
      // Find and display the smell
      let found = false;
      Object.values(codeSmells.general).forEach(category => {
        const smell = category.find(s =>
          s.name.toLowerCase() === smellName.toLowerCase()
        );
        if (smell) {
          displaySmell(smell);
          found = true;
        }
      });
    }
  });
  ```

---

### Phase 4: Workshop Integration (15 min)

#### Add Welcome Modal for First Visit

**File:** `index.html`

- [ ] **Add modal HTML** (at the end of body, before scripts)
  ```html
  <!-- Welcome Modal -->
  <div id="welcomeModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>👋 Welcome to Code Smells Reference</h2>
        <button class="modal-close" onclick="closeWelcomeModal()">&times;</button>
      </div>
      <div class="modal-body">
        <p><strong>This interactive dashboard is part of ShippyPro's AI-Assisted Engineering Workshop.</strong></p>

        <h3>📚 What You'll Find Here</h3>
        <ul>
          <li>✓ All 11 code smells from Session 1</li>
          <li>✓ Side-by-side bad vs. good examples</li>
          <li>✓ Step-by-step fix instructions</li>
          <li>✓ Search and random practice mode</li>
        </ul>

        <h3>🎯 How to Use</h3>
        <ol>
          <li>Browse smells by category or use the <strong>Workshop</strong> tab</li>
          <li>Click any smell to see examples and fixes</li>
          <li>Mark smells as "learned" to track your progress</li>
          <li>Use <strong>Random Smell</strong> for practice</li>
        </ol>

        <h3>🔗 Workshop Materials</h3>
        <p>
          <a href="https://github.com/ShippyPro/refactoring-workshop-skills" target="_blank">
            📦 Download Claude Code Skills & Examples
          </a>
        </p>

        <div class="modal-footer">
          <label>
            <input type="checkbox" id="dontShowAgain"> Don't show this again
          </label>
          <button class="btn btn--primary" onclick="closeWelcomeModal()">
            Get Started
          </button>
        </div>
      </div>
    </div>
  </div>
  ```

**File:** `style.css`

- [ ] **Add modal styles**
  ```css
  /* Modal */
  .modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 10000;
    align-items: center;
    justify-content: center;
  }

  .modal.show {
    display: flex;
  }

  .modal-content {
    background: var(--color-bg-primary);
    border-radius: 12px;
    max-width: 600px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  }

  .modal-header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--color-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
  }

  .modal-close {
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: var(--color-text-secondary);
    line-height: 1;
  }

  .modal-close:hover {
    color: var(--color-text-primary);
  }

  .modal-body {
    padding: 1.5rem;
  }

  .modal-body h3 {
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }

  .modal-body ul, .modal-body ol {
    margin-left: 1.5rem;
  }

  .modal-body li {
    margin: 0.5rem 0;
  }

  .modal-footer {
    padding: 1.5rem;
    border-top: 1px solid var(--color-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  ```

**File:** `app.js`

- [ ] **Add modal functions**
  ```javascript
  // Welcome modal
  function showWelcomeModal() {
    const modal = document.getElementById('welcomeModal');
    if (modal) {
      modal.classList.add('show');
    }
  }

  function closeWelcomeModal() {
    const modal = document.getElementById('welcomeModal');
    const dontShowAgain = document.getElementById('dontShowAgain').checked;

    if (dontShowAgain) {
      localStorage.setItem('welcomeModalSeen', 'true');
    }

    modal.classList.remove('show');
  }

  // Show modal on first visit
  window.addEventListener('load', () => {
    const hasSeenModal = localStorage.getItem('welcomeModalSeen');
    if (!hasSeenModal) {
      setTimeout(showWelcomeModal, 500);
    }
  });

  // Close modal on background click
  document.getElementById('welcomeModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'welcomeModal') {
      closeWelcomeModal();
    }
  });
  ```

#### Add "From Workshop" Attribution

**File:** `index.html`

- [ ] **Add footer attribution** (at end of main content area)
  ```html
  <!-- Add before closing </body> -->
  <footer class="main-footer">
    <p>
      Built for <strong>ShippyPro Engineering Workshop</strong> ·
      Based on <a href="https://refactoring.com/catalog/" target="_blank">Martin Fowler's Refactoring Catalog</a> ·
      <a href="https://github.com/ShippyPro/refactoring-workshop-skills" target="_blank">View on GitHub</a>
    </p>
  </footer>
  ```

**File:** `style.css`

- [ ] **Style footer**
  ```css
  .main-footer {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 350px; /* sidebar width */
    padding: 1rem;
    background: var(--color-bg-secondary);
    border-top: 1px solid var(--color-border);
    text-align: center;
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    z-index: 100;
  }

  .main-footer a {
    color: var(--color-primary);
    text-decoration: none;
  }

  .main-footer a:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .main-footer {
      left: 0;
      position: relative;
    }
  }
  ```

---

### Phase 5: Testing & Polish (30 min)

#### Browser Testing

- [ ] **Test in Chrome**
  - [ ] All tabs work (General, Lambda, Workshop)
  - [ ] Search filters correctly
  - [ ] Random button works
  - [ ] Mark as learned persists after reload
  - [ ] Keyboard shortcuts work
  - [ ] Share button copies link
  - [ ] Welcome modal shows on first visit
  - [ ] Code examples render with syntax highlighting

- [ ] **Test in Safari**
  - [ ] All features work
  - [ ] Styles render correctly
  - [ ] No console errors

- [ ] **Test in Firefox**
  - [ ] All features work
  - [ ] Styles render correctly
  - [ ] No console errors

#### Mobile Testing

- [ ] **Test on mobile device** (iPhone/Android)
  - [ ] Hamburger menu opens/closes sidebar
  - [ ] Tabs are tappable
  - [ ] Code examples are readable
  - [ ] Search works
  - [ ] Modal displays properly
  - [ ] Landscape and portrait modes work

#### Accessibility Testing

- [ ] **Keyboard navigation**
  - [ ] Can navigate without mouse
  - [ ] Tab order is logical
  - [ ] Focus indicators visible
  - [ ] All interactive elements reachable

- [ ] **Screen reader** (optional but recommended)
  - [ ] Test with VoiceOver (Mac) or NVDA (Windows)
  - [ ] All content is readable
  - [ ] Buttons have clear labels

#### Performance Testing

- [ ] **Check load time**
  - [ ] Page loads in < 2 seconds
  - [ ] No console errors
  - [ ] Prism.js loads from CDN

- [ ] **Check responsiveness**
  - [ ] No lag when switching tabs
  - [ ] Search filters instantly
  - [ ] Smooth animations

#### Content Verification

- [ ] **Verify all Workshop smells**
  - [ ] All 11 Session 1 smells are marked with workshop flag
  - [ ] Workshop tab shows correct count (11)
  - [ ] All examples have good code/bad code
  - [ ] Fix steps are clear and actionable

- [ ] **Verify links**
  - [ ] GitHub repo links work
  - [ ] Skills guide links work
  - [ ] External links open in new tab

---

### Phase 6: Deployment (30 min)

#### Option A: Add to Workshop Repository

- [ ] **Copy dashboard to workshop repo**
  ```bash
  cd /Users/amir/Desktop/workshop_planning/refactoring-workshop-skills
  mkdir dashboard
  cp /Users/amir/Desktop/code-smells-dashboard/* dashboard/
  ```

- [ ] **Add README to dashboard directory**
  ```bash
  # Create dashboard/README.md
  ```

  ```markdown
  # Code Smells Dashboard

  Interactive reference for all code smells covered in the workshop.

  ## Local Development

  ```bash
  cd dashboard
  python3 -m http.server 8000
  # Visit http://localhost:8000
  ```

  ## Live Demo

  https://shippypro.github.io/refactoring-workshop-skills/dashboard/

  ## Features

  - 11 code smells from Session 1
  - Side-by-side code comparisons
  - Search and random practice
  - Progress tracking
  - Mobile responsive
  ```

- [ ] **Commit and push**
  ```bash
  cd /Users/amir/Desktop/workshop_planning/refactoring-workshop-skills
  git add dashboard/
  git commit -m "feat: add interactive code smells dashboard"
  git push origin main
  ```

- [ ] **Enable GitHub Pages** (if not already enabled)
  - Go to repo settings
  - Pages → Source → main branch
  - Save
  - Note the URL (will be in deployment section)

- [ ] **Test live URL**
  - Visit: https://shippypro.github.io/refactoring-workshop-skills/dashboard/
  - Verify everything works
  - Test on mobile

#### Update Workshop Materials with Dashboard Link

- [ ] **Update workshop README**

  Edit `/Users/amir/Desktop/workshop_planning/refactoring-workshop-skills/README.md`

  Add section after Quick Start:
  ```markdown
  ## 🎯 Interactive Dashboard

  **Try the live demo:** [Code Smells Reference Dashboard](https://shippypro.github.io/refactoring-workshop-skills/dashboard/)

  Interactive tool featuring:
  - All 11 code smells from Session 1
  - Side-by-side bad vs. good code examples
  - Search and random practice mode
  - Progress tracking (mark as learned)
  - Mobile responsive

  Perfect for learning, reference during coding, or team sharing.
  ```

- [ ] **Update Session 1 materials**

  Edit `/Users/amir/Desktop/workshop_planning/session_1/README.md`

  Add to Materials Distribution section:
  ```markdown
  ### Distribute During Session
  - Visual reference sheet (after Part 2)
  - **Interactive Dashboard** (demo during Part 2, share link)
  - Workshop skills ZIP files (after Part 3 demo)
  - Commands (optional, after Part 3)
  ```

- [ ] **Update RUN-OF-SHOW.md**

  Edit `/Users/amir/Desktop/workshop_planning/session_1/facilitator-guide/RUN-OF-SHOW.md`

  Add to Part 2 demos:
  ```markdown
  **Demo: Interactive Dashboard** (2 min)

  Share link: https://shippypro.github.io/refactoring-workshop-skills/dashboard/

  "Quick demo of the interactive dashboard - bookmark this!
  - Click Workshop tab to see Session 1 smells
  - Search for any smell
  - Mark as learned to track progress
  - Use Random Smell for practice

  This works on your phone too - bookmark it for quick reference."
  ```

---

## 🎨 Optional Enhancements (If Time Permits)

### Add Dark/Light Mode Toggle

- [ ] Add theme toggle button to header
- [ ] Implement theme switching with localStorage
- [ ] Add dark mode CSS variables

### Add Print Stylesheet

- [ ] Create print-friendly version
- [ ] Hide sidebar when printing
- [ ] Format code examples for print

### Add Export Feature

- [ ] Export learned smells as JSON
- [ ] Import progress from file
- [ ] Share progress with team

---

## ✅ Final Checklist

### Before Committing

- [ ] All links work and go to correct destinations
- [ ] No console errors in any browser
- [ ] Mobile view works perfectly
- [ ] Workshop tab shows exactly 11 smells
- [ ] All 11 smells have workshop badge
- [ ] LocalStorage persistence works
- [ ] Welcome modal appears on first visit
- [ ] Keyboard shortcuts work
- [ ] Code examples are syntax-highlighted

### Before Going Live

- [ ] Tested on production URL
- [ ] Mobile testing complete
- [ ] All workshop materials updated with dashboard link
- [ ] Demo script prepared for Session 1
- [ ] Screenshot taken for documentation

### Communication

- [ ] Updated CLAUDE.md in dashboard directory
- [ ] Added to main workshop README
- [ ] Mentioned in Session 1 materials
- [ ] Link ready to share in Slack

---

## 📸 Screenshots Needed

Take screenshots for documentation:

- [ ] Desktop view - General tab
- [ ] Desktop view - Workshop tab
- [ ] Mobile view - Sidebar open
- [ ] Mobile view - Code example
- [ ] Welcome modal
- [ ] Share dialog

---

## 🚀 Launch Message Template

**For Slack/Email after Session 1:**

```
🎉 New Learning Tool: Code Smells Dashboard

We've launched an interactive reference for all the code smells from today's workshop!

🔗 Try it now: https://shippypro.github.io/refactoring-workshop-skills/dashboard/

Features:
✓ All 11 code smells from Session 1
✓ Side-by-side bad vs. good examples
✓ Search any smell instantly
✓ Random practice mode
✓ Track your learning progress
✓ Works on mobile too!

Perfect for:
📱 Quick reference while coding
📚 Study and practice
🔖 Bookmark for your team

Tip: Click the "Workshop" tab to see only Session 1 smells!

Questions? Create an issue on GitHub or ask in this channel.
```

---

## 📝 Notes & Tips

### Common Issues

**Prism.js not loading:**
- Check CDN link is correct in index.html
- Verify internet connection
- Check browser console for errors

**LocalStorage not persisting:**
- Check browser allows localStorage
- Verify JSON.stringify/parse is working
- Check for typos in localStorage keys

**Mobile sidebar won't close:**
- Verify hamburger button event listener
- Check z-index of overlay
- Test click outside to close

### Best Practices

**When editing code examples:**
- Keep examples under 30 lines
- Use clear comments
- Show real-world scenarios
- Include complexity metrics where relevant

**When adding new smells:**
- Add to appropriate category
- Include workshop flag if for Session 1
- Provide both bad and good examples
- Write clear fix steps

### Testing Shortcuts

**Quick browser test:**
```bash
# Start server
cd /Users/amir/Desktop/code-smells-dashboard
python3 -m http.server 8000

# Visit http://localhost:8000
```

**Clear localStorage (for testing):**
```javascript
// In browser console:
localStorage.clear()
location.reload()
```

---

## ⏱️ Time Breakdown

- Phase 1: Branding (30 min)
- Phase 2: Content (45 min)
- Phase 3: UX (30 min)
- Phase 4: Workshop Integration (15 min)
- Phase 5: Testing (30 min)
- Phase 6: Deployment (30 min)

**Total: ~3 hours**

---

## ✨ Success Criteria

**You'll know it's ready when:**

1. ✅ All Session 1 smells are in the Workshop tab
2. ✅ Dashboard is live and accessible via GitHub Pages
3. ✅ Mobile experience is smooth
4. ✅ Progress persists across sessions
5. ✅ All links point to correct workshop materials
6. ✅ Welcome modal guides new users
7. ✅ Share functionality works
8. ✅ No console errors
9. ✅ Keyboard shortcuts enhance UX
10. ✅ Ready to demo in Session 1 Part 2

---

**Questions while working?** Create an issue in the repo or check the dashboard's CLAUDE.md file for architecture details.

**Good luck! This will be an awesome addition to the workshop! 🚀**
