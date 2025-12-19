// Course Management System
class CourseManager {
    constructor() {
        this.currentModule = 1;
        this.currentLesson = 1;
        this.completedModules = new Set();
        this.completedLessons = new Set();
        this.courseStarted = false;
        
        this.moduleData = {
            1: {
                title: "IT Fundamentals for Business",
                lessons: [
                    {
                        title: "Understanding Your IT Infrastructure",
                        content: `
                            <h3>Understanding Your IT Infrastructure</h3>
                            <p>Your IT infrastructure is the foundation that supports all your business operations. Think of it as the nervous system of your organization - when it works well, everything flows smoothly. When it doesn't, productivity grinds to a halt.</p>
                            
                            <h4>Key Components of IT Infrastructure:</h4>
                            <ul>
                                <li><strong>Hardware:</strong> Computers, servers, routers, switches, and mobile devices</li>
                                <li><strong>Software:</strong> Operating systems, applications, and security tools</li>
                                <li><strong>Network:</strong> Internet connection, WiFi, and internal networking</li>
                                <li><strong>Data Storage:</strong> Local drives, cloud storage, and backup systems</li>
                                <li><strong>Security:</strong> Firewalls, antivirus, and access controls</li>
                            </ul>
                            
                            <h4>Why This Matters:</h4>
                            <p>Every component needs to work together seamlessly. A failure in one area can cascade and affect your entire business. Understanding these components helps you make informed decisions about investments, maintenance, and upgrades.</p>
                            
                            <div class="lesson-tip">
                                <strong>Pro Tip:</strong> Document your current IT assets. Create a simple inventory of all computers, software licenses, and network equipment. This will be invaluable for planning and budgeting.
                            </div>
                        `
                    },
                    {
                        title: "Common IT Challenges for Small Businesses",
                        content: `
                            <h3>Common IT Challenges for Small Businesses</h3>
                            <p>Small businesses face unique IT challenges that differ significantly from larger enterprises. Understanding these challenges is the first step to addressing them effectively.</p>
                            
                            <h4>Top 5 IT Challenges:</h4>
                            <ol>
                                <li><strong>Limited IT Budget:</strong> Competing priorities mean IT often gets underfunded</li>
                                <li><strong>No Dedicated IT Staff:</strong> Employees wearing multiple hats, including IT support</li>
                                <li><strong>Reactive vs. Proactive:</strong> Fixing problems after they occur instead of preventing them</li>
                                <li><strong>Security Vulnerabilities:</strong> Lacking enterprise-grade security measures</li>
                                <li><strong>Outdated Technology:</strong> Using old systems that slow down productivity</li>
                            </ol>
                            
                            <h4>The Real Cost of IT Problems:</h4>
                            <ul>
                                <li>Average downtime costs: $5,600 per minute for small businesses</li>
                                <li>Employee productivity loss: 21.6 hours per week dealing with IT issues</li>
                                <li>Lost revenue from system outages and slow performance</li>
                                <li>Customer dissatisfaction due to technical problems</li>
                            </ul>
                            
                            <div class="lesson-exercise">
                                <strong>Quick Assessment:</strong> How many hours last week did your team spend dealing with IT problems instead of focusing on core business activities?
                            </div>
                        `
                    },
                    {
                        title: "The Business Impact of Poor IT",
                        content: `
                            <h3>The Business Impact of Poor IT</h3>
                            <p>Poor IT management doesn't just create technical problems - it directly impacts your bottom line, employee morale, and customer satisfaction.</p>
                            
                            <h4>Direct Financial Impact:</h4>
                            <ul>
                                <li><strong>Lost Productivity:</strong> Employees can't work when systems are down</li>
                                <li><strong>Emergency Repairs:</strong> Fixing problems costs 5x more than preventing them</li>
                                <li><strong>Data Loss Recovery:</strong> Can cost thousands and may not be fully recoverable</li>
                                <li><strong>Compliance Fines:</strong> Regulatory penalties for security breaches</li>
                            </ul>
                            
                            <h4>Hidden Costs:</h4>
                            <ul>
                                <li><strong>Employee Frustration:</strong> Good people leave due to technology frustrations</li>
                                <li><strong>Customer Experience:</strong> Slow or unreliable systems damage your reputation</li>
                                <li><strong>Missed Opportunities:</strong> Can't take advantage of new business due to technical limitations</li>
                                <li><strong>Competitive Disadvantage:</strong> Competitors with better IT can outpace you</li>
                            </ul>
                            
                            <h4>Case Study: The $50,000 Server Crash</h4>
                            <p>A local accounting firm ignored backup warnings for months. When their server crashed during tax season, they lost 3 days of work, had to pay $15,000 for emergency data recovery, lost $25,000 in billable hours, and paid $10,000 in late filing penalties for clients. Total cost: $50,000 - all preventable with proper IT management.</p>
                            
                            <div class="lesson-reflection">
                                <strong>Think About It:</strong> What would happen to your business if your main computer systems went down for 3 days next week?
                            </div>
                        `
                    },
                    {
                        title: "Building an IT Strategy",
                        content: `
                            <h3>Building an IT Strategy</h3>
                            <p>An IT strategy aligns your technology decisions with your business goals. It's not about having the latest gadgets - it's about having the right technology to support your business growth.</p>
                            
                            <h4>Key Elements of an IT Strategy:</h4>
                            <ol>
                                <li><strong>Business Alignment:</strong> Technology should support your business objectives</li>
                                <li><strong>Risk Management:</strong> Identify and mitigate potential IT risks</li>
                                <li><strong>Budget Planning:</strong> Plan for both ongoing costs and major investments</li>
                                <li><strong>Scalability:</strong> Ensure technology can grow with your business</li>
                                <li><strong>Performance Metrics:</strong> Measure success and ROI</li>
                            </ol>
                            
                            <h4>Questions to Guide Your Strategy:</h4>
                            <ul>
                                <li>What are your business goals for the next 3 years?</li>
                                <li>How does technology currently help or hinder these goals?</li>
                                <li>What would happen if you doubled your staff tomorrow?</li>
                                <li>What IT problems keep you awake at night?</li>
                                <li>How much is IT currently costing you (including hidden costs)?</li>
                            </ul>
                            
                            <h4>The Strategic IT Framework:</h4>
                            <div style="background: #f8fafc; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                                <strong>Assess → Plan → Implement → Monitor → Improve</strong>
                                <p style="margin-top: 0.5rem; font-size: 0.9rem;">This continuous cycle ensures your IT strategy evolves with your business needs.</p>
                            </div>
                            
                            <div class="lesson-action">
                                <strong>Action Item:</strong> Schedule 30 minutes this week to write down your top 3 business goals and identify how technology could better support each one.
                            </div>
                        `
                    }
                ]
            }
            // Add more modules here...
        };
        
        this.loadProgress();
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        // Course start functionality
        window.startCourse = () => this.startCourse();
        window.openModule = (moduleNum) => this.openModule(moduleNum);
        window.closeModal = () => this.closeModal();
        window.nextLesson = () => this.nextLesson();
        window.previousLesson = () => this.previousLesson();
    }
    
    startCourse() {
        this.courseStarted = true;
        this.updateProgressDisplay();
        this.openModule(1);
        
        // Show progress section
        const progressSection = document.getElementById('course-progress');
        if (progressSection) {
            progressSection.style.display = 'block';
        }
        
        this.saveProgress();
    }
    
    openModule(moduleNum) {
        if (!this.courseStarted && moduleNum > 1) {
            alert('Please start the course from Module 1');
            return;
        }
        
        if (moduleNum > this.currentModule + 1) {
            alert('Please complete the previous modules first');
            return;
        }
        
        this.currentModule = moduleNum;
        this.currentLesson = 1;
        
        this.displayModuleContent();
        this.updateModuleCards();
        this.saveProgress();
    }
    
    displayModuleContent() {
        const modal = document.getElementById('courseModal');
        const moduleTitle = document.getElementById('moduleTitle');
        const moduleContent = document.getElementById('moduleContent');
        
        const module = this.moduleData[this.currentModule];
        if (!module) return;
        
        const lesson = module.lessons[this.currentLesson - 1];
        if (!lesson) return;
        
        moduleTitle.textContent = `${module.title} - Lesson ${this.currentLesson}`;
        moduleContent.innerHTML = lesson.content;
        
        modal.style.display = 'block';
        
        // Update navigation buttons
        this.updateNavigationButtons();
    }
    
    updateNavigationButtons() {
        const module = this.moduleData[this.currentModule];
        const prevBtn = document.querySelector('.modal-footer .btn-secondary');
        const nextBtn = document.querySelector('.modal-footer .btn-primary');
        
        // Previous button
        if (this.currentLesson === 1 && this.currentModule === 1) {
            prevBtn.disabled = true;
            prevBtn.textContent = 'First Lesson';
        } else {
            prevBtn.disabled = false;
            prevBtn.textContent = 'Previous';
        }
        
        // Next button
        if (this.currentLesson >= module.lessons.length) {
            if (this.currentModule >= Object.keys(this.moduleData).length) {
                nextBtn.textContent = 'Complete Course';
            } else {
                nextBtn.textContent = 'Next Module';
            }
        } else {
            nextBtn.textContent = 'Next Lesson';
        }
    }
    
    nextLesson() {
        const module = this.moduleData[this.currentModule];
        
        // Mark current lesson as complete
        const lessonId = `${this.currentModule}-${this.currentLesson}`;
        this.completedLessons.add(lessonId);
        
        if (this.currentLesson < module.lessons.length) {
            // Next lesson in same module
            this.currentLesson++;
            this.displayModuleContent();
        } else {
            // Module complete, move to next module
            this.completedModules.add(this.currentModule);
            
            if (this.currentModule < Object.keys(this.moduleData).length) {
                this.currentModule++;
                this.currentLesson = 1;
                this.displayModuleContent();
            } else {
                // Course complete!
                this.completeCourse();
            }
        }
        
        this.updateProgressDisplay();
        this.updateModuleCards();
        this.saveProgress();
    }
    
    previousLesson() {
        if (this.currentLesson > 1) {
            this.currentLesson--;
        } else if (this.currentModule > 1) {
            this.currentModule--;
            const prevModule = this.moduleData[this.currentModule];
            this.currentLesson = prevModule.lessons.length;
        }
        
        this.displayModuleContent();
        this.updateNavigationButtons();
    }
    
    closeModal() {
        const modal = document.getElementById('courseModal');
        modal.style.display = 'none';
    }
    
    updateProgressDisplay() {
        const totalLessons = Object.values(this.moduleData).reduce((total, module) => {
            return total + module.lessons.length;
        }, 0);
        
        const completedLessonsCount = this.completedLessons.size;
        const progress = Math.round((completedLessonsCount / totalLessons) * 100);
        
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        if (progressFill && progressText) {
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${progress}% Complete`;
        }
    }
    
    updateModuleCards() {
        const moduleCards = document.querySelectorAll('.module-card');
        
        moduleCards.forEach((card, index) => {
            const moduleNum = index + 1;
            const moduleBtn = card.querySelector('.module-btn');
            const moduleIcon = card.querySelector('.module-icon');
            
            // Reset classes
            card.classList.remove('completed', 'current');
            
            if (this.completedModules.has(moduleNum)) {
                // Completed module
                card.classList.add('completed');
                moduleIcon.className = 'fas fa-check-circle module-icon';
                moduleBtn.textContent = 'Review Module';
                moduleBtn.disabled = false;
            } else if (moduleNum === this.currentModule) {
                // Current module
                card.classList.add('current');
                moduleIcon.className = 'fas fa-play-circle module-icon';
                moduleBtn.textContent = 'Continue Module';
                moduleBtn.disabled = false;
            } else if (moduleNum === this.currentModule + 1 || (this.currentModule === 1 && moduleNum === 1)) {
                // Next available module
                moduleIcon.className = 'fas fa-unlock module-icon';
                moduleBtn.textContent = 'Start Module';
                moduleBtn.disabled = false;
            } else {
                // Locked module
                moduleIcon.className = 'fas fa-lock module-icon';
                moduleBtn.textContent = 'Locked';
                moduleBtn.disabled = true;
            }
        });
    }
    
    completeCourse() {
        alert('Congratulations! You have completed the IT Mastery Course!');
        this.closeModal();
        
        // Show completion message and certificate option
        const completionHTML = `
            <div style="text-align: center; padding: 2rem; background: linear-gradient(135deg, #10b981, #059669); color: white; border-radius: 12px; margin: 2rem 0;">
                <h2>🎉 Course Completed!</h2>
                <p>You've successfully completed the IT Mastery Course. You now have the knowledge to make informed decisions about your business technology.</p>
                <a href="../contact.html" class="btn" style="background: white; color: #059669; margin-top: 1rem;">Get Your Certificate</a>
            </div>
        `;
        
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.innerHTML = completionHTML;
        }
    }
    
    saveProgress() {
        const progress = {
            courseStarted: this.courseStarted,
            currentModule: this.currentModule,
            currentLesson: this.currentLesson,
            completedModules: Array.from(this.completedModules),
            completedLessons: Array.from(this.completedLessons)
        };
        
        localStorage.setItem('badgerTechCourseProgress', JSON.stringify(progress));
    }
    
    loadProgress() {
        const saved = localStorage.getItem('badgerTechCourseProgress');
        if (saved) {
            const progress = JSON.parse(saved);
            this.courseStarted = progress.courseStarted || false;
            this.currentModule = progress.currentModule || 1;
            this.currentLesson = progress.currentLesson || 1;
            this.completedModules = new Set(progress.completedModules || []);
            this.completedLessons = new Set(progress.completedLessons || []);
            
            if (this.courseStarted) {
                const progressSection = document.getElementById('course-progress');
                if (progressSection) {
                    progressSection.style.display = 'block';
                }
                this.updateProgressDisplay();
                this.updateModuleCards();
            }
        }
    }
}

// Additional utility functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Add custom styles for lesson content
const lessonStyles = `
    .lesson-tip {
        background: #eff6ff;
        border-left: 4px solid #3b82f6;
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 0 8px 8px 0;
    }
    
    .lesson-exercise {
        background: #fef3c7;
        border-left: 4px solid #f59e0b;
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 0 8px 8px 0;
    }
    
    .lesson-reflection {
        background: #f3e8ff;
        border-left: 4px solid #8b5cf6;
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 0 8px 8px 0;
    }
    
    .lesson-action {
        background: #ecfdf5;
        border-left: 4px solid #10b981;
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 0 8px 8px 0;
    }
    
    .modal-body h3 {
        color: #1f2937;
        margin-bottom: 1rem;
    }
    
    .modal-body h4 {
        color: #374151;
        margin: 1.5rem 0 0.5rem 0;
    }
    
    .modal-body ul, .modal-body ol {
        margin: 1rem 0;
        padding-left: 1.5rem;
    }
    
    .modal-body li {
        margin-bottom: 0.5rem;
        line-height: 1.6;
    }
    
    .modal-body p {
        margin-bottom: 1rem;
        line-height: 1.6;
        color: #4b5563;
    }
`;

// Inject lesson styles
const styleSheet = document.createElement('style');
styleSheet.textContent = lessonStyles;
document.head.appendChild(styleSheet);

// Initialize course when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.courseManager = new CourseManager();
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('courseModal');
        if (event.target === modal) {
            window.courseManager.closeModal();
        }
    };
    
    // Handle escape key to close modal
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            window.courseManager.closeModal();
        }
    });
});

// Scroll to course overview when clicking "View Curriculum"
document.addEventListener('click', function(e) {
    if (e.target.getAttribute('href') === '#course-overview') {
        e.preventDefault();
        scrollToSection('course-overview');
    }
});