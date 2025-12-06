/* ==========================================
   GLOBAL VARIABLES
   ========================================== */

// Store current selected template
let currentTemplate = 1
let currentIndex = 0
const cvData = {} // Store all CV data
let selectedFont = "Poppins"
let selectedColor = "#393E46"
let selectedTextColor = "#00ADB5"

// Define which templates require photo (templates 2, 3, 6, 8 have photos)
const templatesWithPhoto = [2, 3, 6, 8]

/* ==========================================
   NAVIGATION FUNCTIONS
   ========================================== */

// Smooth scroll to template section
function scrollToTemplates() {
  document.getElementById("templateSection").scrollIntoView({
    behavior: "smooth",
  })
}

/* ==========================================
   TEMPLATE CAROUSEL FUNCTIONS
   ========================================== */

// Scroll templates left or right - one card at a time, centered
function scrollTemplates(direction) {
  const carousel = document.querySelector(".template-carousel")
  const card = document.querySelector(".template-card")
  const cardWidth = card.offsetWidth + 30 // Card width + gap
  const carouselWidth = carousel.offsetWidth

  if (direction === "left") {
    currentIndex = Math.max(0, currentIndex - 1)
  } else {
    currentIndex = Math.min(7, currentIndex + 1)
  }

  // Center the selected card in the carousel
  const cardPosition = currentIndex * cardWidth
  const centerOffset = carouselWidth / 2 - cardWidth / 2
  const scrollPosition = cardPosition - centerOffset

  carousel.scrollTo({
    left: scrollPosition,
    behavior: "smooth",
  })

  // Update selected template
  updateSelectedTemplate(currentIndex)
}

// Go to specific template by index - centered
function goToTemplate(index) {
  currentIndex = index
  const carousel = document.querySelector(".template-carousel")
  const card = document.querySelector(".template-card")
  const cardWidth = card.offsetWidth + 30 // Card width + gap
  const carouselWidth = carousel.offsetWidth

  // Center the selected card in the carousel
  const cardPosition = index * cardWidth
  const centerOffset = carouselWidth / 2 - cardWidth / 2
  const scrollPosition = cardPosition - centerOffset

  carousel.scrollTo({
    left: scrollPosition,
    behavior: "smooth",
  })

  updateSelectedTemplate(index)
}

// Update visual selection of template
function updateSelectedTemplate(index) {
  // Remove selection from all cards
  const cards = document.querySelectorAll(".template-card")
  cards.forEach((card) => card.classList.remove("selected"))

  // Add selection to current card
  cards[index].classList.add("selected")

  // Update dot indicators
  const dots = document.querySelectorAll(".dot")
  dots.forEach((dot) => dot.classList.remove("active"))
  dots[index].classList.add("active")

  // Update current template number
  currentTemplate = index + 1
}

// Initialize first template as selected
window.addEventListener("load", () => {
  updateSelectedTemplate(0)

  // apply initial text color variable so preview reflects default immediately
  document.documentElement.style.setProperty('--cv-text-color', selectedTextColor)

  // Set footer year if footer exists
  const fy = document.getElementById('footerYear')
  if (fy) fy.textContent = new Date().getFullYear()

  // Attach click handlers to each template card so tapping centers selection
  const cards = document.querySelectorAll('.template-card')
  cards.forEach((card, idx) => {
    card.addEventListener('click', (e) => {
      // prevent triggering create button when its clicked
      if (e.target.closest('.create-btn')) return
      goToTemplate(idx)
    })
  })

  // If opened with ?template=N param (from templates page), open modal for that template
  try{
    const params = new URLSearchParams(window.location.search)
    const t = params.get('template')
    if(t){
      const n = parseInt(t,10)
      if(!isNaN(n)){
        // If we're on index, open modal; if not, navigation will land here anyway
        startCVCreation(n)
      }
    }
  }catch(e){/* ignore */}
})

/* ==========================================
   CV CREATION MODAL FUNCTIONS
   ========================================== */

// Start CV creation process with selected template
function startCVCreation(templateNumber) {
  currentTemplate = templateNumber

  // Update modal title
  document.getElementById("templateName").textContent = `Template ${templateNumber}`

  // Show/hide photo section based on template
  const photoSection = document.getElementById("photoSection")
  if (templatesWithPhoto.includes(templateNumber)) {
    photoSection.style.display = "block"
  } else {
    photoSection.style.display = "none"
  }

  // Show modal
  document.getElementById("cvModal").classList.add("show")
  document.body.style.overflow = "hidden" // Prevent background scrolling
}

// Close CV creation modal
function closeModal() {
  document.getElementById("cvModal").classList.remove("show")
  document.body.style.overflow = "auto"
}

/* ==========================================
   THEME & FONT CUSTOMIZATION
   ========================================== */

// Update theme color
function updateTheme() {
  selectedColor = document.getElementById("themeColor").value
}

// Update text color used in CV preview
function updateTextColor() {
  selectedTextColor = document.getElementById("textColor").value
  document.documentElement.style.setProperty('--cv-text-color', selectedTextColor)
}

// Update font style
function updateFont() {
  selectedFont = document.getElementById("fontStyle").value
}

// Select font from button options
function selectFont(fontName) {
  selectedFont = fontName
  
  // Update active button state
  document.querySelectorAll('.font-option').forEach(btn => {
    btn.classList.remove('active')
    if (btn.getAttribute('data-font') === fontName) {
      btn.classList.add('active')
    }
  })
  
  // Trigger preview update
  previewCV()
}

// Initialize font buttons on page load
document.addEventListener('DOMContentLoaded', function() {
  const defaultFont = 'Poppins'
  selectedFont = defaultFont
  
  // Set initial active button
  document.querySelectorAll('.font-option').forEach(btn => {
    if (btn.getAttribute('data-font') === defaultFont) {
      btn.classList.add('active')
    }
  })
})

/* ==========================================
   PHOTO UPLOAD & PREVIEW
   ========================================== */

// Preview uploaded photo
function previewPhoto(event) {
  const file = event.target.files[0]
  const preview = document.getElementById("photoPreview")

  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      preview.innerHTML = `<img src="${e.target.result}" alt="Profile photo preview">`
    }
    reader.readAsDataURL(file)
  }
}

/* ==========================================
   DYNAMIC FORM FIELDS (Add More)
   ========================================== */

// Add new education entry
function addEducation() {
  const container = document.getElementById("educationContainer")
  const newEntry = document.createElement("div")
  newEntry.className = "education-entry"
  newEntry.innerHTML = `
        <input type="text" placeholder="Degree/Qualification" class="education-degree">
        <input type="text" placeholder="Institution Name" class="education-institution">
        <div class="form-row">
            <input type="text" placeholder="Year (e.g., 2020-2024)" class="education-year">
            <input type="text" placeholder="Grade/CGPA" class="education-grade">
        </div>
    `
  container.appendChild(newEntry)
}

// Add new experience entry
function addExperience() {
  const container = document.getElementById("experienceContainer")
  const newEntry = document.createElement("div")
  newEntry.className = "experience-entry"
  newEntry.innerHTML = `
        <input type="text" placeholder="Job Title" class="experience-title">
        <input type="text" placeholder="Company Name" class="experience-company">
        <div class="form-row">
            <input type="text" placeholder="Duration (e.g., 2020-2022)" class="experience-duration">
        </div>
        <textarea placeholder="Job Description & Responsibilities" rows="3" class="experience-description"></textarea>
    `
  container.appendChild(newEntry)
}

// Add new skill entry
function addSkill() {
  const container = document.getElementById("skillsContainer")
  const newEntry = document.createElement("div")
  newEntry.className = "skill-entry"
  newEntry.innerHTML = `
        <input type="text" placeholder="Skill Name" class="skill-name">
        <select class="skill-level">
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
        </select>
    `
  container.appendChild(newEntry)
}

/* ==========================================
   COLLECT CV DATA FROM FORM
   ========================================== */

function collectCVData() {
  // Get personal information
  cvData.fullName = document.getElementById("fullName").value
  cvData.email = document.getElementById("email").value
  cvData.phone = document.getElementById("phone").value
  cvData.address = document.getElementById("address").value
  cvData.summary = document.getElementById("summary").value

  // Text color preference
  cvData.textColor = document.getElementById("textColor") ? document.getElementById("textColor").value : selectedTextColor

  // Get photo if applicable
  const photoPreview = document.querySelector("#photoPreview img")
  cvData.photo = photoPreview ? photoPreview.src : null

  // Collect all education entries
  cvData.education = []
  const educationEntries = document.querySelectorAll(".education-entry")
  educationEntries.forEach((entry) => {
    const degree = entry.querySelector(".education-degree").value
    const institution = entry.querySelector(".education-institution").value
    const year = entry.querySelector(".education-year").value
    const grade = entry.querySelector(".education-grade").value

    if (degree || institution) {
      // Only add if not empty
      cvData.education.push({ degree, institution, year, grade })
    }
  })

  // Collect all experience entries
  cvData.experience = []
  const experienceEntries = document.querySelectorAll(".experience-entry")
  experienceEntries.forEach((entry) => {
    const title = entry.querySelector(".experience-title").value
    const company = entry.querySelector(".experience-company").value
    const duration = entry.querySelector(".experience-duration").value
    const description = entry.querySelector(".experience-description").value

    if (title || company) {
      // Only add if not empty
      cvData.experience.push({ title, company, duration, description })
    }
  })

  // Collect all skills
  cvData.skills = []
  const skillEntries = document.querySelectorAll(".skill-entry")
  skillEntries.forEach((entry) => {
    const name = entry.querySelector(".skill-name").value
    const level = entry.querySelector(".skill-level").value

    if (name) {
      // Only add if not empty
      cvData.skills.push({ name, level })
    }
  })

  // Get additional sections
  cvData.languages = document.getElementById("languages").value
  cvData.certifications = document.getElementById("certifications").value
  cvData.hobbies = document.getElementById("hobbies").value

  // Store theme and font
  cvData.themeColor = selectedColor
  cvData.font = selectedFont

  return cvData
}

/* ==========================================
   GENERATE CV PREVIEW
   ========================================== */

function previewCV() {
  // Collect all form data
  const data = collectCVData()

  // Validate required fields
  if (!data.fullName || !data.email || !data.phone) {
    alert("Please fill in all required fields (Name, Email, Phone)")
    return
  }

  // Generate CV HTML
  const cvHTML = generateCVHTML(data)

  // Display in preview modal
  const cvPreviewElement = document.getElementById("cvPreview")
  cvPreviewElement.innerHTML = cvHTML

  // Apply custom styles
  document.documentElement.style.setProperty("--theme-color", data.themeColor)
  document.documentElement.style.setProperty("--cv-font", data.font)
  document.documentElement.style.setProperty("--cv-text-color", data.textColor || selectedTextColor)
  
  // Apply font to all elements in CV preview
  const cvContent = cvPreviewElement.querySelector('div')
  if (cvContent) {
    cvContent.style.fontFamily = `${data.font}, Arial, sans-serif`
  }

  // Show preview modal
  document.getElementById("previewModal").classList.add("show")
}

/* ==========================================
   GENERATE CV HTML STRUCTURE
   ========================================== */

function generateCVHTML(data) {
  // Template 2: Sidebar Layout (Professional with left sidebar)
  if (currentTemplate === 2) {
    return generateTemplate2Sidebar(data)
  }
  
  // Template 3: Left Sidebar with Circular Photo
  if (currentTemplate === 3) {
    return generateTemplate3Sidebar(data)
  }
  
  // Template 4: Left Sidebar without Photo (Professional)
  if (currentTemplate === 4) {
    return generateTemplate4Sidebar(data)
  }
  
  // Template 5: Two-Column with Photo Header
  if (currentTemplate === 5) {
    return generateTemplate5Professional(data)
  }
  
  // Default: Simple layout for all other templates
  let html = '<div class="cv-content">'

  // Header Section with Photo (if applicable)
  html += '<div class="cv-header">'
  if (data.photo && templatesWithPhoto.includes(currentTemplate)) {
    html += `<img src="${data.photo}" alt="Profile photo" class="cv-photo">`
  }
  html += `<h1>${data.fullName}</h1>`
  html += `<div class="cv-contact">`
  html += `<span>📧 ${data.email}</span>`
  html += `<span>📱 ${data.phone}</span>`
  html += `<span>📍 ${data.address}</span>`
  html += `</div>`
  html += "</div>"

  // Professional Summary
  if (data.summary) {
    html += `<div class="cv-section">`
    html += `<h2>Professional Summary</h2>`
    html += `<p>${data.summary}</p>`
    html += `</div>`
  }

  // Education Section
  if (data.education.length > 0) {
    html += `<div class="cv-section">`
    html += `<h2>Education</h2>`
    data.education.forEach((edu) => {
      html += `<div class="cv-item">`
      html += `<h3>${edu.degree}</h3>`
      html += `<p><strong>${edu.institution}</strong></p>`
      html += `<p>${edu.year} | Grade: ${edu.grade}</p>`
      html += `</div>`
    })
    html += `</div>`
  }

  // Experience Section
  if (data.experience.length > 0) {
    html += `<div class="cv-section">`
    html += `<h2>Work Experience</h2>`
    data.experience.forEach((exp) => {
      html += `<div class="cv-item">`
      html += `<h3>${exp.title}</h3>`
      html += `<p><strong>${exp.company}</strong> | ${exp.duration}</p>`
      html += `<p>${exp.description}</p>`
      html += `</div>`
    })
    html += `</div>`
  }

  // Skills Section
  if (data.skills.length > 0) {
    html += `<div class="cv-section">`
    html += `<h2>Skills</h2>`
    data.skills.forEach((skill) => {
      html += `<div class="cv-item">`
      html += `<p><strong>${skill.name}</strong> - ${skill.level}</p>`
      html += `</div>`
    })
    html += `</div>`
  }

  // Languages
  if (data.languages) {
    html += `<div class="cv-section">`
    html += `<h2>Languages</h2>`
    html += `<p>${data.languages}</p>`
    html += `</div>`
  }

  // Certifications
  if (data.certifications) {
    html += `<div class="cv-section">`
    html += `<h2>Certifications</h2>`
    html += `<p>${data.certifications}</p>`
    html += `</div>`
  }

  // Hobbies
  if (data.hobbies) {
    html += `<div class="cv-section">`
    html += `<h2>Hobbies & Interests</h2>`
    html += `<p>${data.hobbies}</p>`
    html += `</div>`
  }

  html += "</div>"
  return html
}

/* ==========================================
   TEMPLATE 2: SIDEBAR LAYOUT
   Professional CV with left sidebar (matching template image)
   ========================================== */

function generateTemplate2Sidebar(data) {
  // A4 page size with margins: reduces to ~1000px to fit on single page
  let html = '<div style="display:flex;width:800px;height:1000px;background:#ffffff;font-family:Poppins,Arial,sans-serif;margin:0;padding:0">'
  
  // LEFT SIDEBAR (Light blue background) - Always full height
  html += '<div style="width:28%;background:#d6e4f0;padding:25px 20px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:flex-start">'
  
  // Profile Photo
  if (data.photo) {
    html += `<div style="text-align:center;margin-bottom:20px"><img src="${data.photo}" alt="Profile" style="width:120px;height:140px;border-radius:12px;object-fit:cover;border:4px solid #4f46e5;display:block;margin:0 auto"></div>`
  }
  
  // Contact Section
  html += '<div style="margin-bottom:18px">'
  html += `<h3 style="font-size:12px;font-weight:700;color:#4f46e5;margin:0 0 10px 0;letter-spacing:1px;text-transform:uppercase">CONTACT</h3>`
  html += `<div style="font-size:11px;line-height:1.7;color:#374151">`
  html += `<div style="margin-bottom:6px"><strong>Email:</strong></div>`
  html += `<div style="margin-bottom:10px;word-break:break-word">${data.email}</div>`
  html += `<div style="margin-bottom:6px"><strong>Phone:</strong></div>`
  html += `<div style="margin-bottom:10px">${data.phone}</div>`
  html += `<div style="margin-bottom:6px"><strong>Location:</strong></div>`
  html += `<div style="margin-bottom:10px">${data.address}</div>`
  html += '</div></div>'
  
  // Key Skills (Sidebar)
  if (data.skills.length > 0) {
    html += '<div style="margin-bottom:18px">'
    html += `<h3 style="font-size:12px;font-weight:700;color:#4f46e5;margin:0 0 10px 0;letter-spacing:1px;text-transform:uppercase">KEY SKILLS</h3>`
    html += '<div style="font-size:11px;line-height:1.8;color:#374151">'
    data.skills.forEach(skill => {
      html += `<div style="margin-bottom:6px">• <strong>${skill.name}</strong></div>`
    })
    html += '</div></div>'
  }
  
  // Languages (Sidebar)
  if (data.languages) {
    html += '<div style="margin-bottom:18px">'
    html += `<h3 style="font-size:12px;font-weight:700;color:#4f46e5;margin:0 0 10px 0;letter-spacing:1px;text-transform:uppercase">LANGUAGES</h3>`
    html += `<div style="font-size:11px;line-height:1.7;color:#374151;white-space:pre-wrap">${data.languages}</div>`
    html += '</div>'
  }
  
  // Certifications (Sidebar)
  if (data.certifications) {
    html += '<div style="margin-bottom:0">'
    html += `<h3 style="font-size:12px;font-weight:700;color:#4f46e5;margin:0 0 10px 0;letter-spacing:1px;text-transform:uppercase">CERTIFICATIONS</h3>`
    html += `<div style="font-size:11px;line-height:1.7;color:#374151;white-space:pre-wrap">${data.certifications}</div>`
    html += '</div>'
  }
  
  html += '</div>'
  
  // RIGHT CONTENT AREA - Always full height
  html += '<div style="width:72%;padding:25px;box-sizing:border-box;background:#ffffff;display:flex;flex-direction:column;justify-content:flex-start;overflow:hidden">'
  
  // Header with Name
  html += `<div style="margin-bottom:20px;border-bottom:3px solid #4f46e5;padding-bottom:12px">`
  html += `<h1 style="font-size:28px;font-weight:700;color:#4f46e5;margin:0 0 5px 0">${data.fullName}</h1>`
  html += `<p style="font-size:12px;color:#6b7280;margin:0">Professional Profile</p>`
  html += '</div>'
  
  // Professional Summary
  if (data.summary) {
    html += '<div style="margin-bottom:18px">'
    html += `<h2 style="font-size:12px;font-weight:700;color:#374151;margin:0 0 8px 0;letter-spacing:0.5px;border-bottom:2px solid #e5e7eb;padding-bottom:6px;text-transform:uppercase">PROFESSIONAL SUMMARY</h2>`
    html += `<p style="font-size:11px;line-height:1.6;color:#374151;white-space:pre-wrap;margin:0">${data.summary}</p>`
    html += '</div>'
  }
  
  // Education Section
  if (data.education.length > 0) {
    html += '<div style="margin-bottom:18px">'
    html += `<h2 style="font-size:12px;font-weight:700;color:#374151;margin:0 0 8px 0;letter-spacing:0.5px;border-bottom:2px solid #e5e7eb;padding-bottom:6px;text-transform:uppercase">EDUCATION</h2>`
    data.education.forEach(edu => {
      html += `<div style="margin-bottom:10px">`
      html += `<div style="display:flex;justify-content:space-between;align-items:baseline">`
      html += `<strong style="font-size:11px;color:#4f46e5">${edu.degree}</strong>`
      html += `<span style="font-size:11px;color:#6b7280">${edu.year}</span>`
      html += '</div>'
      html += `<div style="font-size:11px;color:#6b7280;margin-top:2px">${edu.institution}</div>`
      if (edu.grade) html += `<div style="font-size:10px;color:#9ca3af">Grade: ${edu.grade}</div>`
      html += '</div>'
    })
    html += '</div>'
  }
  
  // Experience Section
  if (data.experience.length > 0) {
    html += '<div style="margin-bottom:0">'
    html += `<h2 style="font-size:12px;font-weight:700;color:#374151;margin:0 0 8px 0;letter-spacing:0.5px;border-bottom:2px solid #e5e7eb;padding-bottom:6px;text-transform:uppercase">WORK EXPERIENCE</h2>`
    data.experience.forEach(exp => {
      html += `<div style="margin-bottom:10px">`
      html += `<div style="display:flex;justify-content:space-between;align-items:baseline">`
      html += `<strong style="font-size:11px;color:#4f46e5">${exp.title}</strong>`
      html += `<span style="font-size:11px;color:#6b7280">${exp.duration}</span>`
      html += '</div>'
      html += `<div style="font-size:11px;color:#6b7280;margin-top:2px">${exp.company}</div>`
      html += `<p style="font-size:11px;color:#374151;margin:4px 0 0 0;white-space:pre-wrap">${exp.description}</p>`
      html += '</div>'
    })
    html += '</div>'
  }
  
  html += '</div>'
  html += '</div>'
  
  return html
}

/* ==========================================
   TEMPLATE 3: SIDEBAR WITH CIRCULAR PHOTO
   Professional CV with left beige sidebar and circular photo
   ========================================== */

function generateTemplate3Sidebar(data) {
  // A4 page size with margins: reduces to ~1000px to fit on single page with 15px top + 10px sides
  let html = '<div style="display:flex;width:800px;height:1000px;background:#ffffff;font-family:Poppins,Arial,sans-serif;margin:0;padding:0">'
  
  // LEFT SIDEBAR (Beige/Tan background) - Always full height
  html += '<div style="width:32%;background:#e8dcc8;padding:30px 20px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:flex-start">'
  
  // Profile Photo - Circular
  if (data.photo) {
    html += `<div style="text-align:center;margin-bottom:25px"><img src="${data.photo}" alt="Profile" style="width:130px;height:130px;border-radius:50%;object-fit:cover;display:block;margin:0 auto;border:none"></div>`
  }
  
  // Name in sidebar
  html += `<div style="text-align:center;margin-bottom:20px;border-bottom:2px solid #8b7355;padding-bottom:15px">`
  html += `<h1 style="font-size:20px;font-weight:700;color:#1a1a1a;margin:0">${data.fullName}</h1>`
  html += `<p style="font-size:11px;color:#6b7280;margin:5px 0 0 0;text-transform:uppercase">Software Engineer</p>`
  html += '</div>'
  
  // About Me / Summary (Sidebar)
  if (data.summary) {
    html += '<div style="margin-bottom:20px">'
    html += `<h3 style="font-size:11px;font-weight:700;color:#8b7355;margin:0 0 8px 0;letter-spacing:1px;text-transform:uppercase">About Me</h3>`
    html += `<p style="font-size:10px;line-height:1.6;color:#374151;white-space:pre-wrap;margin:0">${data.summary}</p>`
    html += '</div>'
  }
  
  // Objectives (if certifications field used for objectives)
  if (data.certifications) {
    html += '<div style="margin-bottom:20px">'
    html += `<h3 style="font-size:11px;font-weight:700;color:#8b7355;margin:0 0 8px 0;letter-spacing:1px;text-transform:uppercase">Objectives</h3>`
    html += `<p style="font-size:10px;line-height:1.6;color:#374151;white-space:pre-wrap;margin:0">${data.certifications}</p>`
    html += '</div>'
  }
  
  // Contact Section
  html += '<div style="margin-bottom:20px">'
  html += `<h3 style="font-size:11px;font-weight:700;color:#8b7355;margin:0 0 8px 0;letter-spacing:1px;text-transform:uppercase">Contact</h3>`
  html += `<div style="font-size:10px;line-height:1.7;color:#374151">`
  html += `<div style="margin-bottom:5px"><strong>Email</strong><br>${data.email}</div>`
  html += `<div style="margin-bottom:5px"><strong>Phone</strong><br>${data.phone}</div>`
  html += `<div><strong>Address</strong><br>${data.address}</div>`
  html += '</div></div>'
  
  // Languages (Sidebar)
  if (data.languages) {
    html += '<div style="margin-bottom:20px">'
    html += `<h3 style="font-size:11px;font-weight:700;color:#8b7355;margin:0 0 8px 0;letter-spacing:1px;text-transform:uppercase">Languages</h3>`
    html += `<p style="font-size:10px;line-height:1.6;color:#374151;white-space:pre-wrap;margin:0">${data.languages}</p>`
    html += '</div>'
  }
  
  // Reference (if hobbies field used)
  if (data.hobbies) {
    html += '<div>'
    html += `<h3 style="font-size:11px;font-weight:700;color:#8b7355;margin:0 0 8px 0;letter-spacing:1px;text-transform:uppercase">Reference</h3>`
    html += `<p style="font-size:10px;line-height:1.6;color:#374151;white-space:pre-wrap;margin:0">${data.hobbies}</p>`
    html += '</div>'
  }
  
  html += '</div>'
  
  // RIGHT CONTENT AREA - Always full height
  html += '<div style="width:68%;padding:30px;box-sizing:border-box;background:#ffffff;display:flex;flex-direction:column;justify-content:flex-start;overflow:hidden">'
  
  // Experience Section
  if (data.experience.length > 0) {
    html += '<div style="margin-bottom:20px">'
    html += `<h2 style="font-size:13px;font-weight:700;color:#1a1a1a;margin:0 0 10px 0;letter-spacing:0.5px;border-bottom:2px solid #8b7355;padding-bottom:6px;text-transform:uppercase">Experience</h2>`
    data.experience.forEach(exp => {
      html += `<div style="margin-bottom:12px">`
      html += `<div style="display:flex;justify-content:space-between;align-items:baseline">`
      html += `<strong style="font-size:11px;color:#1a1a1a">${exp.title}</strong>`
      html += `<span style="font-size:10px;color:#6b7280">${exp.duration}</span>`
      html += '</div>'
      html += `<div style="font-size:11px;color:#6b7280;margin-top:2px">${exp.company}</div>`
      html += `<p style="font-size:10px;color:#374151;margin:4px 0 0 0;white-space:pre-wrap;line-height:1.5">${exp.description}</p>`
      html += '</div>'
    })
    html += '</div>'
  }
  
  // Skills Section
  if (data.skills.length > 0) {
    html += '<div style="margin-bottom:20px">'
    html += `<h2 style="font-size:13px;font-weight:700;color:#1a1a1a;margin:0 0 10px 0;letter-spacing:0.5px;border-bottom:2px solid #8b7355;padding-bottom:6px;text-transform:uppercase">Skills</h2>`
    html += '<div style="display:flex;flex-wrap:wrap;gap:8px">'
    data.skills.forEach(skill => {
      html += `<span style="background:#e8dcc8;color:#1a1a1a;padding:4px 10px;border-radius:4px;font-size:10px">${skill.name}</span>`
    })
    html += '</div></div>'
  }
  
  // Education Section
  if (data.education.length > 0) {
    html += '<div style="margin-bottom:20px">'
    html += `<h2 style="font-size:13px;font-weight:700;color:#1a1a1a;margin:0 0 10px 0;letter-spacing:0.5px;border-bottom:2px solid #8b7355;padding-bottom:6px;text-transform:uppercase">Education</h2>`
    data.education.forEach(edu => {
      html += `<div style="margin-bottom:10px">`
      html += `<div style="display:flex;justify-content:space-between;align-items:baseline">`
      html += `<strong style="font-size:11px;color:#1a1a1a">${edu.degree}</strong>`
      html += `<span style="font-size:10px;color:#6b7280">${edu.year}</span>`
      html += '</div>'
      html += `<div style="font-size:11px;color:#6b7280">${edu.institution}</div>`
      if (edu.grade) html += `<div style="font-size:10px;color:#9ca3af">Grade: ${edu.grade}</div>`
      html += '</div>'
    })
    html += '</div>'
  }
  
  // Projects (if needed, using certifications)
  if (data.certifications) {
    html += '<div>'
    html += `<h2 style="font-size:13px;font-weight:700;color:#1a1a1a;margin:0 0 10px 0;letter-spacing:0.5px;border-bottom:2px solid #8b7355;padding-bottom:6px;text-transform:uppercase">Projects</h2>`
    html += `<p style="font-size:10px;color:#374151;white-space:pre-wrap;margin:0;line-height:1.5">${data.certifications}</p>`
    html += '</div>'
  }
  
  html += '</div>'
  html += '</div>'
  
  return html
}

/* ==========================================
   TEMPLATE 4: SIDEBAR WITHOUT PHOTO
   Professional CV with left beige sidebar (no photo)
   ========================================== */

function generateTemplate4Sidebar(data) {
  // A4 page size with margins: 950px height to fit on single page
  let html = '<div style="display:flex;width:800px;height:950px;background:#ffffff;font-family:Poppins,Arial,sans-serif;margin:0;padding:0">'
  
  // LEFT SIDEBAR (Beige/Tan background) - No photo
  html += '<div style="width:32%;background:#e8dcc8;padding:30px 20px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:flex-start">'
  
  // Name in sidebar
  html += `<div style="text-align:center;margin-bottom:20px;border-bottom:2px solid #8b7355;padding-bottom:15px">`
  html += `<h1 style="font-size:22px;font-weight:700;color:#1a1a1a;margin:0">${data.fullName}</h1>`
  html += `<p style="font-size:11px;color:#6b7280;margin:5px 0 0 0;text-transform:uppercase">Professional</p>`
  html += '</div>'
  
  // About Me / Summary (Sidebar)
  if (data.summary) {
    html += '<div style="margin-bottom:18px">'
    html += `<h3 style="font-size:11px;font-weight:700;color:#8b7355;margin:0 0 8px 0;letter-spacing:1px;text-transform:uppercase">About Me</h3>`
    html += `<p style="font-size:10px;line-height:1.6;color:#374151;white-space:pre-wrap;margin:0">${data.summary}</p>`
    html += '</div>'
  }
  
  // Objectives (if certifications field used)
  if (data.hobbies) {
    html += '<div style="margin-bottom:18px">'
    html += `<h3 style="font-size:11px;font-weight:700;color:#8b7355;margin:0 0 8px 0;letter-spacing:1px;text-transform:uppercase">Objectives</h3>`
    html += `<p style="font-size:10px;line-height:1.6;color:#374151;white-space:pre-wrap;margin:0">${data.hobbies}</p>`
    html += '</div>'
  }
  
  // Contact Section
  html += '<div style="margin-bottom:18px">'
  html += `<h3 style="font-size:11px;font-weight:700;color:#8b7355;margin:0 0 8px 0;letter-spacing:1px;text-transform:uppercase">Contact</h3>`
  html += `<div style="font-size:10px;line-height:1.7;color:#374151">`
  html += `<div style="margin-bottom:5px"><strong>Email</strong><br>${data.email}</div>`
  html += `<div style="margin-bottom:5px"><strong>Phone</strong><br>${data.phone}</div>`
  html += `<div><strong>Address</strong><br>${data.address}</div>`
  html += '</div></div>'
  
  // Languages (Sidebar)
  if (data.languages) {
    html += '<div>'
    html += `<h3 style="font-size:11px;font-weight:700;color:#8b7355;margin:0 0 8px 0;letter-spacing:1px;text-transform:uppercase">Languages</h3>`
    html += `<p style="font-size:10px;line-height:1.6;color:#374151;white-space:pre-wrap;margin:0">${data.languages}</p>`
    html += '</div>'
  }
  
  html += '</div>'
  
  // RIGHT CONTENT AREA - Always full height
  html += '<div style="width:68%;padding:30px;box-sizing:border-box;background:#ffffff;display:flex;flex-direction:column;justify-content:flex-start;overflow:hidden">'
  
  // Experience Section
  if (data.experience.length > 0) {
    html += '<div style="margin-bottom:18px">'
    html += `<h2 style="font-size:13px;font-weight:700;color:#1a1a1a;margin:0 0 10px 0;letter-spacing:0.5px;border-bottom:2px solid #8b7355;padding-bottom:6px;text-transform:uppercase">Experience</h2>`
    data.experience.forEach(exp => {
      html += `<div style="margin-bottom:12px">`
      html += `<div style="display:flex;justify-content:space-between;align-items:baseline">`
      html += `<strong style="font-size:11px;color:#1a1a1a">${exp.title}</strong>`
      html += `<span style="font-size:10px;color:#6b7280">${exp.duration}</span>`
      html += '</div>'
      html += `<div style="font-size:11px;color:#6b7280;margin-top:2px">${exp.company}</div>`
      html += `<p style="font-size:10px;color:#374151;margin:4px 0 0 0;white-space:pre-wrap;line-height:1.5">${exp.description}</p>`
      html += '</div>'
    })
    html += '</div>'
  }
  
  // Skills Section
  if (data.skills.length > 0) {
    html += '<div style="margin-bottom:18px">'
    html += `<h2 style="font-size:13px;font-weight:700;color:#1a1a1a;margin:0 0 10px 0;letter-spacing:0.5px;border-bottom:2px solid #8b7355;padding-bottom:6px;text-transform:uppercase">Skills</h2>`
    html += '<div style="display:flex;flex-wrap:wrap;gap:8px">'
    data.skills.forEach(skill => {
      html += `<span style="background:#e8dcc8;color:#1a1a1a;padding:4px 10px;border-radius:4px;font-size:10px">${skill.name}</span>`
    })
    html += '</div></div>'
  }
  
  // Education Section
  if (data.education.length > 0) {
    html += '<div style="margin-bottom:18px">'
    html += `<h2 style="font-size:13px;font-weight:700;color:#1a1a1a;margin:0 0 10px 0;letter-spacing:0.5px;border-bottom:2px solid #8b7355;padding-bottom:6px;text-transform:uppercase">Education</h2>`
    data.education.forEach(edu => {
      html += `<div style="margin-bottom:10px">`
      html += `<div style="display:flex;justify-content:space-between;align-items:baseline">`
      html += `<strong style="font-size:11px;color:#1a1a1a">${edu.degree}</strong>`
      html += `<span style="font-size:10px;color:#6b7280">${edu.year}</span>`
      html += '</div>'
      html += `<div style="font-size:11px;color:#6b7280">${edu.institution}</div>`
      if (edu.grade) html += `<div style="font-size:10px;color:#9ca3af">Grade: ${edu.grade}</div>`
      html += '</div>'
    })
    html += '</div>'
  }
  
  // Projects (if needed, using certifications)
  if (data.certifications) {
    html += '<div>'
    html += `<h2 style="font-size:13px;font-weight:700;color:#1a1a1a;margin:0 0 10px 0;letter-spacing:0.5px;border-bottom:2px solid #8b7355;padding-bottom:6px;text-transform:uppercase">Projects</h2>`
    html += `<p style="font-size:10px;color:#374151;white-space:pre-wrap;margin:0;line-height:1.5">${data.certifications}</p>`
    html += '</div>'
  }
  
  html += '</div>'
  html += '</div>'
  
  return html
}

/* ==========================================
   TEMPLATE 5: PROFESSIONAL WITH PHOTO HEADER
   Two-column layout with photo, name header, and detailed sections
   ========================================== */

function generateTemplate5Professional(data) {
  // A4 page size: 950px height for single page
  let html = '<div style="display:flex;flex-direction:column;width:800px;height:950px;background:#ffffff;font-family:Poppins,Arial,sans-serif;margin:0;padding:0">'
  
  // HEADER WITH PHOTO
  html += '<div style="display:flex;background:#4a4a4a;padding:20px;box-sizing:border-box;gap:20px;align-items:flex-start">'
  
  // Photo (Left side of header)
  if (data.photo) {
    html += `<div style="flex-shrink:0"><img src="${data.photo}" alt="Profile" style="width:120px;height:140px;border:4px solid white;object-fit:cover;border-radius:4px"></div>`
  }
  
  // Name and Title (Right side of header)
  html += '<div style="flex-grow:1;color:white">'
  html += `<h1 style="font-size:28px;font-weight:700;margin:0 0 8px 0">${data.fullName}</h1>`
  html += `<p style="font-size:13px;margin:0 0 15px 0">Sale Executive</p>`
  
  // Contact info in header
  html += '<div style="font-size:11px;line-height:1.8;display:flex;flex-wrap:wrap;gap:20px">'
  html += `<span>📅 April 4, 1987</span>`
  html += `<span>📱 ${data.phone}</span>`
  html += `<span>📍 ${data.address}</span>`
  html += `<span>✉️ ${data.email}</span>`
  html += '</div>'
  html += '</div>'
  html += '</div>'
  
  // SEPARATOR LINE
  html += '<div style="height:2px;background:#8b7355"></div>'
  
  // CONTENT AREA - Two columns
  html += '<div style="display:flex;flex:1;overflow:hidden">'
  
  // LEFT COLUMN (40%)
  html += '<div style="width:40%;padding:20px;box-sizing:border-box;border-right:2px solid #e5e7eb;overflow-y:auto">'
  
  // Objective Section
  if (data.summary) {
    html += '<div style="margin-bottom:16px">'
    html += `<h2 style="font-size:12px;font-weight:700;color:#1a1a1a;margin:0 0 8px 0;text-transform:uppercase;border-bottom:2px solid #8b7355;padding-bottom:5px">Objective</h2>`
    html += `<p style="font-size:10px;line-height:1.6;color:#374151;white-space:pre-wrap;margin:0">${data.summary}</p>`
    html += '</div>'
  }
  
  // Skills Section
  if (data.skills.length > 0) {
    html += '<div style="margin-bottom:16px">'
    html += `<h2 style="font-size:12px;font-weight:700;color:#1a1a1a;margin:0 0 10px 0;text-transform:uppercase;border-bottom:2px solid #8b7355;padding-bottom:5px">Skills</h2>`
    data.skills.forEach(skill => {
      html += `<div style="margin-bottom:8px;font-size:10px">`
      html += `<div style="color:#1a1a1a;margin-bottom:3px"><strong>${skill.name}</strong></div>`
      html += `<div style="display:flex;gap:3px">`
      // Display rating as circles
      for (let i = 0; i < 5; i++) {
        const filled = i < (skill.level === 'Expert' ? 5 : skill.level === 'Intermediate' ? 4 : skill.level === 'Beginner' ? 2 : 3)
        html += `<span style="width:8px;height:8px;border-radius:50%;background:${filled ? '#4a4a4a' : '#d1d5db'};display:inline-block"></span>`
      }
      html += '</div></div>'
    })
    html += '</div>'
  }
  
  // Certifications Section
  if (data.certifications) {
    html += '<div style="margin-bottom:16px">'
    html += `<h2 style="font-size:12px;font-weight:700;color:#1a1a1a;margin:0 0 8px 0;text-transform:uppercase;border-bottom:2px solid #8b7355;padding-bottom:5px">Certifications</h2>`
    html += `<p style="font-size:10px;line-height:1.6;color:#374151;white-space:pre-wrap;margin:0">${data.certifications}</p>`
    html += '</div>'
  }
  
  // Interests Section
  if (data.hobbies) {
    html += '<div>'
    html += `<h2 style="font-size:12px;font-weight:700;color:#1a1a1a;margin:0 0 8px 0;text-transform:uppercase;border-bottom:2px solid #8b7355;padding-bottom:5px">Interests</h2>`
    html += `<p style="font-size:10px;line-height:1.6;color:#374151;white-space:pre-wrap;margin:0">${data.hobbies}</p>`
    html += '</div>'
  }
  
  html += '</div>'
  
  // RIGHT COLUMN (60%)
  html += '<div style="width:60%;padding:20px;box-sizing:border-box;overflow-y:auto">'
  
  // Education Section
  if (data.education.length > 0) {
    html += '<div style="margin-bottom:16px">'
    html += `<h2 style="font-size:12px;font-weight:700;color:#1a1a1a;margin:0 0 10px 0;text-transform:uppercase;border-bottom:2px solid #8b7355;padding-bottom:5px">Education</h2>`
    data.education.forEach(edu => {
      html += `<div style="margin-bottom:12px;font-size:10px">`
      html += `<strong style="color:#1a1a1a;text-transform:uppercase">${edu.degree}</strong><br>`
      html += `<span style="color:#4a4a4a;font-style:italic">${edu.institution}</span><br>`
      html += `<span style="color:#6b7280">${edu.year} | GPA: ${edu.grade}</span>`
      html += '</div>'
    })
    html += '</div>'
  }
  
  // Work Experience Section
  if (data.experience.length > 0) {
    html += '<div style="margin-bottom:16px">'
    html += `<h2 style="font-size:12px;font-weight:700;color:#1a1a1a;margin:0 0 10px 0;text-transform:uppercase;border-bottom:2px solid #8b7355;padding-bottom:5px">Work Experience</h2>`
    data.experience.forEach(exp => {
      html += `<div style="margin-bottom:12px;font-size:10px">`
      html += `<strong style="color:#1a1a1a;text-transform:uppercase">${exp.company}</strong><span style="color:#6b7280;float:right">${exp.duration}</span><br>`
      html += `<span style="color:#4a4a4a;font-style:italic">${exp.title}</span><br>`
      if (exp.description) html += `<p style="margin:6px 0 0 0;color:#374151;white-space:pre-wrap;line-height:1.5">${exp.description}</p>`
      html += '</div>'
    })
    html += '</div>'
  }
  
  // Activities Section (using languages field)
  if (data.languages) {
    html += '<div>'
    html += `<h2 style="font-size:12px;font-weight:700;color:#1a1a1a;margin:0 0 10px 0;text-transform:uppercase;border-bottom:2px solid #8b7355;padding-bottom:5px">Activities</h2>`
    html += `<p style="font-size:10px;line-height:1.6;color:#374151;white-space:pre-wrap;margin:0">${data.languages}</p>`
    html += '</div>'
  }
  
  html += '</div>'
  html += '</div>'
  html += '</div>'
  
  return html
}

/* ==========================================
   CLOSE PREVIEW MODAL
   ========================================== */

function closePreview() {
  document.getElementById("previewModal").classList.remove("show")
}

/* ==========================================
   GENERATE CV (Same as Preview for now)
   ========================================== */

function generateCV() {
  previewCV() // Show preview which allows download/print
}

/* ==========================================
   DOWNLOAD CV AS PDF
   ========================================== */

function downloadCV() {
  // Get the CV preview content
  const cvContent = document.getElementById("cvPreview")

  // If html2pdf is available, use it to generate a downloadable PDF
  if (window.html2pdf) {
    // Disable download button while generating
    const downloadBtn = document.querySelector('.download-btn')
    if (downloadBtn) downloadBtn.disabled = true

    // Build filename from name (fallback to 'cv')
    const safeName = (cvData.fullName || 'cv').replace(/[^a-z0-9\-_ ]/gi, '')
    const filename = `${safeName || 'cv'}.pdf`

    const opt = {
      margin:       [0.53, 0.35, 0, 0.35],
      filename:     filename,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true }
    }

    // Ensure images have loaded by waiting a short moment
    setTimeout(() => {
      // Create a wrapper to ensure full page coverage
      const wrapper = document.createElement('div')
      wrapper.style.width = '210mm'
      wrapper.style.height = '297mm'
      wrapper.style.margin = '0'
      wrapper.style.padding = '0'
      wrapper.appendChild(cvContent.cloneNode(true))
      
      const restore = applyScaleToFit(wrapper, { unit: 'mm', format: 'a4', marginInInches: 0 })

      html2pdf().set(opt).from(wrapper).save().then(() => {
        if (downloadBtn) downloadBtn.disabled = false
        if (restore) restore()
      }).catch((err) => {
        console.error('PDF generation error:', err)
        if (downloadBtn) downloadBtn.disabled = false
        if (restore) restore()
        alert('Could not generate PDF. Try using Print -> Save as PDF as fallback.')
      })
    }, 250)

  } else {
    // Fallback: open print dialog so user can Save as PDF
    window.print()
    alert('If the automatic download fails, use Print and select "Save as PDF".')
  }
}

/* ==========================================
   PRINT CV DIRECTLY
   ========================================== */

function printCV() {
  // Open browser print dialog
    const cvContent = document.getElementById('cvPreview')
    // apply scale to fit printable A4 area then call print
    const restore = applyScaleToFit(cvContent, { unit: 'px', format: 'a4', marginInInches: 0.5 })

    // Use onafterprint to restore styles
    function cleanup() {
      if (restore) restore()
      window.removeEventListener('afterprint', cleanup)
    }
    window.addEventListener('afterprint', cleanup)

    // Fallback: also restore after a timeout in case afterprint isn't fired
    setTimeout(() => { if (restore) restore() }, 2000)

    window.print()
}

/* ==========================================
   PRINT STYLES (Add to handle print layout)
   ========================================== */

// Add print-specific styles dynamically
const printStyles = `
  @page { size: A4 portrait; margin: 0; }
  @media print {
    html, body { height: 100%; margin: 0; padding: 0; }
    body * { visibility: hidden; }
    #cvPreview, #cvPreview * { visibility: visible; }
    /* Place the CV at the top-left of the page and remove extra gaps */
    #cvPreview {
      position: absolute;
      left: 0;
      top: 0;
      width: 210mm; /* A4 width */
      box-sizing: border-box;
      margin: 0;
      padding: 12mm 12mm; /* small page padding */
    }
    .modal-header, .modal-footer { display: none !important; }
    /* Avoid page breaks inside sections */
    .cv-section { page-break-inside: avoid; }
  }
`

// Inject print styles into document
const styleSheet = document.createElement("style")
styleSheet.textContent = printStyles
document.head.appendChild(styleSheet)

/* Utility: scale an element so it fits within an A4 printable area (approx px) and return a restore function */
function applyScaleToFit(element, options = {}) {
  try {
    // A4 at 96dpi: 8.27in x 11.69in -> px
    const dpi = 96
    const pageWidthPx = 8.27 * dpi
    const pageHeightPx = 11.69 * dpi
    const marginPx = (options.marginInInches || 0.5) * dpi

    const availW = pageWidthPx - marginPx * 2
    const availH = pageHeightPx - marginPx * 2

    // measure element natural size
    const rect = element.getBoundingClientRect()
    const contentW = rect.width
    const contentH = rect.height

    const scale = Math.min(availW / contentW, availH / contentH, 1)

    if (scale >= 1) return null

    // save original styles
    const orig = {
      transform: element.style.transform || '',
      transformOrigin: element.style.transformOrigin || '',
      width: element.style.width || '',
      boxSizing: element.style.boxSizing || ''
    }

    element.style.transformOrigin = 'top left'
    element.style.transform = `scale(${scale})`
    element.style.boxSizing = 'border-box'

    // return restore function
    return function restore() {
      try {
        element.style.transform = orig.transform
        element.style.transformOrigin = orig.transformOrigin
        element.style.width = orig.width
        element.style.boxSizing = orig.boxSizing
      } catch (e) {
        console.error('restore error', e)
      }
    }
  } catch (e) {
    console.error('applyScaleToFit error', e)
    return null
  }
}

// Mobile overlay and hamburger toggle (open/close, close on backdrop or ESC)
const hamburgerMenu = document.querySelector('.hamburger-menu');
const mobileOverlay = document.querySelector('.mobile-overlay');
const closeBtn = mobileOverlay ? mobileOverlay.querySelector('.close-btn') : null;

function openOverlay() {
  if (!mobileOverlay) return;
  mobileOverlay.classList.add('active');
  document.body.classList.add('no-scroll');
}

function closeOverlay() {
  if (!mobileOverlay) return;
  mobileOverlay.classList.remove('active');
  document.body.classList.remove('no-scroll');
}

if (hamburgerMenu) {
  hamburgerMenu.addEventListener('click', () => {
    if (!mobileOverlay) return;
    if (mobileOverlay.classList.contains('active')) {
      closeOverlay();
    } else {
      openOverlay();
    }
  });
}

if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    closeOverlay();
  });
}

// Close when clicking on the backdrop (only if click target is overlay itself)
if (mobileOverlay) {
  mobileOverlay.addEventListener('click', (e) => {
    if (e.target === mobileOverlay) closeOverlay();
  });
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeOverlay();
});
