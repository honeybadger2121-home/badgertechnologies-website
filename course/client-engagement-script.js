// Client Engagement Training System
class TrainingManager {
    constructor() {
        this.currentModule = 1;
        this.currentLesson = 1;
        this.completedModules = new Set();
        this.completedLessons = new Set();
        this.trainingStarted = false;
        
        this.trainingData = {
            1: {
                title: "Company & Services Overview",
                lessons: [
                    {
                        title: "Badger Technologies Mission & Vision",
                        content: `
                            <h3>Badger Technologies Mission & Vision</h3>
                            <div class="mission-vision">
                                <div class="mission">
                                    <h4>🎯 Our Mission</h4>
                                    <p>To provide enterprise-grade IT consulting, cybersecurity assessments, and managed services to small and medium-sized businesses, enabling them to focus on their core business while we handle their technology infrastructure.</p>
                                </div>
                                <div class="vision">
                                    <h4>🚀 Our Vision</h4>
                                    <p>To become the most trusted IT partner for growing businesses, helping them leverage technology as a competitive advantage rather than a source of frustration.</p>
                                </div>
                            </div>
                            
                            <h4>Company History & Pivot</h4>
                            <p>Badger Technologies was founded in 2024 and has recently completed a strategic pivot from cybersecurity-focused services to comprehensive managed IT services. This pivot was driven by:</p>
                            <ul>
                                <li><strong>Market Demand:</strong> Every business needs IT support, not just security assessments</li>
                                <li><strong>Recurring Revenue:</strong> Monthly managed services vs. one-time projects</li>
                                <li><strong>Customer Relationships:</strong> Long-term partnerships vs. transactional work</li>
                                <li><strong>Scalability:</strong> Predictable monthly revenue that grows with each client</li>
                            </ul>
                            
                            <h4>Current Business Status</h4>
                            <div class="status-grid">
                                <div class="status-item">
                                    <strong>Stage:</strong> Pre-revenue startup in growth phase
                                </div>
                                <div class="status-item">
                                    <strong>Location:</strong> Illinois, Remote/Hybrid operations
                                </div>
                                <div class="status-item">
                                    <strong>Target:</strong> Small-medium businesses (10-50 employees)
                                </div>
                                <div class="status-item">
                                    <strong>Focus:</strong> Managed IT services with industry specialization
                                </div>
                            </div>
                            
                            <div class="lesson-key-takeaway">
                                <strong>Key Takeaway:</strong> We're a growing company with a proven business model, focusing on solving real IT problems for businesses that don't have dedicated IT staff.
                            </div>
                        `
                    },
                    {
                        title: "Service Portfolio Deep Dive",
                        content: `
                            <h3>Service Portfolio Deep Dive</h3>
                            <p>Understanding our complete service offering is crucial for effective sales conversations. Here's what we provide:</p>
                            
                            <h4>🏢 Managed IT Service Packages</h4>
                            
                            <div class="service-tier">
                                <h5>Essential IT Support - $799/month</h5>
                                <div class="tier-details">
                                    <p><strong>Target:</strong> Small businesses (5-15 employees)</p>
                                    <p><strong>Key Features:</strong></p>
                                    <ul>
                                        <li>Unlimited email support (4-hour response)</li>
                                        <li>Phone support (9am-5pm, M-F)</li>
                                        <li>Remote troubleshooting and fixes</li>
                                        <li>Server and network monitoring</li>
                                        <li>Software updates and patches</li>
                                        <li>Backup monitoring and verification</li>
                                    </ul>
                                    <p><strong>Sales Angle:</strong> "Complete IT support for less than the cost of one part-time IT person"</p>
                                </div>
                            </div>
                            
                            <div class="service-tier">
                                <h5>Professional IT Management - $1,499/month</h5>
                                <div class="tier-details">
                                    <p><strong>Target:</strong> Growing businesses (15-35 employees)</p>
                                    <p><strong>Key Features:</strong> Everything in Essential PLUS:</p>
                                    <ul>
                                        <li>Priority support (2-hour response)</li>
                                        <li>Monthly on-site visits included</li>
                                        <li>Cloud backup solutions</li>
                                        <li>Strategic IT planning</li>
                                        <li>Quarterly business reviews</li>
                                    </ul>
                                    <p><strong>Sales Angle:</strong> "Your complete IT department with strategic planning to support your growth"</p>
                                </div>
                            </div>
                            
                            <div class="service-tier">
                                <h5>Enterprise IT Solutions - $2,999/month</h5>
                                <div class="tier-details">
                                    <p><strong>Target:</strong> Larger organizations (35+ employees)</p>
                                    <p><strong>Key Features:</strong> Everything in Professional PLUS:</p>
                                    <ul>
                                        <li>24/7 support availability</li>
                                        <li>Dedicated account manager</li>
                                        <li>Unlimited on-site support</li>
                                        <li>Virtual CIO (vCIO) services</li>
                                        <li>Advanced compliance management</li>
                                    </ul>
                                    <p><strong>Sales Angle:</strong> "Enterprise-grade IT with dedicated resources and strategic leadership"</p>
                                </div>
                            </div>
                            
                            <h4>🏥 Industry-Specific Solutions</h4>
                            <div class="industry-solutions">
                                <div class="industry-item">
                                    <strong>Healthcare IT ($1,999/month):</strong> HIPAA-compliant infrastructure, EHR support, medical device integration
                                </div>
                                <div class="industry-item">
                                    <strong>Legal IT ($1,799/month):</strong> Document management, case management software, confidentiality protocols
                                </div>
                                <div class="industry-item">
                                    <strong>Accounting IT ($1,599/month):</strong> Tax software optimization, financial data security, seasonal scaling
                                </div>
                            </div>
                            
                            <div class="lesson-practice">
                                <strong>Practice Exercise:</strong> Memorize the three main service tiers and be able to explain each in 30 seconds or less. Focus on the target customer and key value proposition for each.
                            </div>
                        `
                    },
                    {
                        title: "Value Propositions & Competitive Advantages",
                        content: `
                            <h3>Value Propositions & Competitive Advantages</h3>
                            <p>Our success depends on clearly articulating why businesses should choose Badger Technologies over alternatives.</p>
                            
                            <h4>🎯 Primary Value Proposition</h4>
                            <div class="value-prop-main">
                                <strong>"Badger Technologies is your complete IT department - for a fraction of the cost of hiring one. We keep your technology running smoothly so you can focus on running your business."</strong>
                            </div>
                            
                            <h4>🏆 Key Competitive Advantages</h4>
                            
                            <div class="advantage-grid">
                                <div class="advantage-item">
                                    <h5>🤝 True Partnership Approach</h5>
                                    <p>We're not just a vendor - we're your technology partner invested in your business success.</p>
                                    <p><strong>Use When:</strong> Prospect mentions bad experiences with previous IT providers</p>
                                </div>
                                
                                <div class="advantage-item">
                                    <h5>⚡ Proactive vs. Reactive</h5>
                                    <p>We prevent problems before they happen instead of just fixing them after they occur.</p>
                                    <p><strong>Use When:</strong> Prospect talks about frequent IT issues or downtime</p>
                                </div>
                                
                                <div class="advantage-item">
                                    <h5>📍 Local & Responsive</h5>
                                    <p>Based in Illinois with fast response times - not offshore support or big corporate MSP.</p>
                                    <p><strong>Use When:</strong> Prospect values personal relationships and local service</p>
                                </div>
                                
                                <div class="advantage-item">
                                    <h5>💰 Transparent Pricing</h5>
                                    <p>Clear, predictable monthly pricing with no hidden fees or surprise bills.</p>
                                    <p><strong>Use When:</strong> Prospect is concerned about costs or has been burned by unexpected charges</p>
                                </div>
                                
                                <div class="advantage-item">
                                    <h5>🎓 Strategic Guidance</h5>
                                    <p>We help you grow by aligning technology with your business goals, not just keeping lights on.</p>
                                    <p><strong>Use When:</strong> Prospect is growing or planning expansion</p>
                                </div>
                                
                                <div class="advantage-item">
                                    <h5>🏥 Industry Expertise</h5>
                                    <p>Specialized knowledge in healthcare, legal, accounting, and professional services.</p>
                                    <p><strong>Use When:</strong> Prospect is in a regulated industry or has specific compliance needs</p>
                                </div>
                            </div>
                            
                            <h4>📊 ROI Messaging</h4>
                            <div class="roi-messaging">
                                <h5>Cost Comparison Framework:</h5>
                                <ul>
                                    <li><strong>Hiring full-time IT person:</strong> $70,000+/year + benefits + training</li>
                                    <li><strong>Emergency IT calls:</strong> $150/hour x frequent issues = $20,000+/year</li>
                                    <li><strong>Our managed IT:</strong> $9,588 - $35,988/year for complete coverage</li>
                                </ul>
                                <p><strong>Message:</strong> "Same great IT support, half the cost, zero headaches."</p>
                            </div>
                            
                            <div class="lesson-challenge">
                                <strong>Challenge:</strong> Practice delivering our main value proposition in under 15 seconds. Time yourself and ensure it sounds natural and confident.
                            </div>
                        `
                    },
                    {
                        title: "Common Customer Objections & Responses",
                        content: `
                            <h3>Common Customer Objections & Responses</h3>
                            <p>Preparation is key to handling objections effectively. Here are the most common objections and proven responses:</p>
                            
                            <div class="objection-response">
                                <h4>💰 "It's too expensive"</h4>
                                <div class="response">
                                    <p><strong>Response Framework:</strong></p>
                                    <ol>
                                        <li><strong>Acknowledge:</strong> "I understand cost is a concern..."</li>
                                        <li><strong>Reframe:</strong> "Let's look at what you're currently spending on IT issues..."</li>
                                        <li><strong>Calculate:</strong> "Between downtime, emergency calls, and lost productivity, most businesses spend more than they realize"</li>
                                        <li><strong>Compare:</strong> "Our service costs less than one emergency server repair"</li>
                                    </ol>
                                    <p><strong>Key Point:</strong> It's not an expense, it's an investment that saves money.</p>
                                </div>
                            </div>
                            
                            <div class="objection-response">
                                <h4>⏰ "We need to think about it"</h4>
                                <div class="response">
                                    <p><strong>Response:</strong> "I completely understand - this is an important decision. Can I ask what specifically you'd like to think about? Is it the investment, the timing, or something else? I might be able to help clarify those points right now."</p>
                                    <p><strong>Follow-up:</strong> "What would need to happen for this to make sense for you?"</p>
                                </div>
                            </div>
                            
                            <div class="objection-response">
                                <h4>🔧 "We already have an IT person/company"</h4>
                                <div class="response">
                                    <p><strong>Response:</strong> "That's great - can you tell me how that's working out? Are you getting the proactive monitoring and strategic planning you need? Many of our best clients had IT support before but weren't getting the complete service they needed to grow their business."</p>
                                    <p><strong>Key Questions:</strong></p>
                                    <ul>
                                        <li>"How quickly do they respond to issues?"</li>
                                        <li>"Do they help with strategic planning?"</li>
                                        <li>"Are your costs predictable each month?"</li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div class="objection-response">
                                <h4>📅 "This isn't the right time"</h4>
                                <div class="response">
                                    <p><strong>Response:</strong> "I appreciate that timing is important. Can you help me understand what would make this a better time? Often, businesses tell us they wish they had started with managed IT sooner because it would have prevented the problems they're dealing with now."</p>
                                    <p><strong>Alternative:</strong> "What if we could start with just monitoring your systems so you're prepared when you're ready for full support?"</p>
                                </div>
                            </div>
                            
                            <div class="objection-response">
                                <h4>🤔 "I need to talk to my partner/team"</h4>
                                <div class="response">
                                    <p><strong>Response:</strong> "Absolutely - this affects the whole team. Would it be helpful if I presented to your team so they can ask questions directly? That way everyone has the same information to make the best decision."</p>
                                    <p><strong>Alternative:</strong> "What questions do you think they'll have? I can help you prepare those answers."</p>
                                </div>
                            </div>
                            
                            <div class="objection-response">
                                <h4>🏢 "We're too small for managed IT"</h4>
                                <div class="response">
                                    <p><strong>Response:</strong> "Actually, small businesses often benefit most from managed IT because you don't have the resources to handle IT problems internally. Our Essential package is designed specifically for businesses your size - you get enterprise-level support without enterprise-level costs."</p>
                                </div>
                            </div>
                            
                            <h4>🎯 Objection Handling Best Practices</h4>
                            <div class="best-practices">
                                <ol>
                                    <li><strong>Listen Completely:</strong> Let them finish their objection</li>
                                    <li><strong>Acknowledge:</strong> Show you understand their concern</li>
                                    <li><strong>Ask Questions:</strong> Understand the real issue behind the objection</li>
                                    <li><strong>Respond Specifically:</strong> Address their exact concern</li>
                                    <li><strong>Confirm:</strong> "Does that address your concern?"</li>
                                </ol>
                            </div>
                            
                            <div class="lesson-roleplay">
                                <strong>Role-Play Exercise:</strong> Practice handling each objection with a colleague. Focus on sounding natural and confident, not scripted.
                            </div>
                        `
                    }
                    // Add more lessons for module 1...
                ]
            }
            // Add more modules with detailed content...
        };
        
        this.loadTrainingProgress();
        this.initializeTrainingEventListeners();
    }
    
    initializeTrainingEventListeners() {
        window.startTraining = () => this.startTraining();
        window.openTrainingModule = (moduleNum) => this.openTrainingModule(moduleNum);
        window.closeTrainingModal = () => this.closeTrainingModal();
        window.nextTrainingLesson = () => this.nextTrainingLesson();
        window.previousTrainingLesson = () => this.previousTrainingLesson();
    }
    
    startTraining() {
        this.trainingStarted = true;
        this.updateTrainingProgressDisplay();
        this.openTrainingModule(1);
        
        // Show progress section
        const progressSection = document.getElementById('training-progress');
        if (progressSection) {
            progressSection.style.display = 'block';
        }
        
        this.saveTrainingProgress();
    }
    
    openTrainingModule(moduleNum) {
        if (!this.trainingStarted && moduleNum > 1) {
            alert('Please start the training program from Module 1');
            return;
        }
        
        if (moduleNum > this.currentModule + 1) {
            alert('Please complete the previous modules first');
            return;
        }
        
        this.currentModule = moduleNum;
        this.currentLesson = 1;
        
        this.displayTrainingModuleContent();
        this.updateTrainingModuleCards();
        this.saveTrainingProgress();
    }
    
    displayTrainingModuleContent() {
        const modal = document.getElementById('trainingModal');
        const moduleTitle = document.getElementById('trainingModuleTitle');
        const moduleContent = document.getElementById('trainingModuleContent');
        
        const module = this.trainingData[this.currentModule];
        if (!module) return;
        
        const lesson = module.lessons[this.currentLesson - 1];
        if (!lesson) return;
        
        moduleTitle.textContent = `${module.title} - Lesson ${this.currentLesson}`;
        moduleContent.innerHTML = lesson.content;
        
        modal.style.display = 'block';
        
        this.updateTrainingNavigationButtons();
    }
    
    updateTrainingNavigationButtons() {
        const module = this.trainingData[this.currentModule];
        const prevBtn = document.querySelector('#trainingModal .modal-footer .btn-secondary');
        const nextBtn = document.querySelector('#trainingModal .modal-footer .btn-primary');
        
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
            if (this.currentModule >= Object.keys(this.trainingData).length) {
                nextBtn.textContent = 'Complete Training';
            } else {
                nextBtn.textContent = 'Next Module';
            }
        } else {
            nextBtn.textContent = 'Next Lesson';
        }
    }
    
    nextTrainingLesson() {
        const module = this.trainingData[this.currentModule];
        
        // Mark current lesson as complete
        const lessonId = `${this.currentModule}-${this.currentLesson}`;
        this.completedLessons.add(lessonId);
        
        if (this.currentLesson < module.lessons.length) {
            // Next lesson in same module
            this.currentLesson++;
            this.displayTrainingModuleContent();
        } else {
            // Module complete, move to next module
            this.completedModules.add(this.currentModule);
            
            if (this.currentModule < Object.keys(this.trainingData).length) {
                this.currentModule++;
                this.currentLesson = 1;
                this.displayTrainingModuleContent();
            } else {
                // Training complete!
                this.completeTraining();
            }
        }
        
        this.updateTrainingProgressDisplay();
        this.updateTrainingModuleCards();
        this.saveTrainingProgress();
    }
    
    previousTrainingLesson() {
        if (this.currentLesson > 1) {
            this.currentLesson--;
        } else if (this.currentModule > 1) {
            this.currentModule--;
            const prevModule = this.trainingData[this.currentModule];
            this.currentLesson = prevModule.lessons.length;
        }
        
        this.displayTrainingModuleContent();
        this.updateTrainingNavigationButtons();
    }
    
    closeTrainingModal() {
        const modal = document.getElementById('trainingModal');
        modal.style.display = 'none';
    }
    
    updateTrainingProgressDisplay() {
        const totalLessons = Object.values(this.trainingData).reduce((total, module) => {
            return total + module.lessons.length;
        }, 0);
        
        const completedLessonsCount = this.completedLessons.size;
        const progress = Math.round((completedLessonsCount / totalLessons) * 100);
        
        const progressFill = document.getElementById('training-progress-fill');
        const progressText = document.getElementById('training-progress-text');
        
        if (progressFill && progressText) {
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${progress}% Complete`;
        }
    }
    
    updateTrainingModuleCards() {
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
    
    completeTraining() {
        alert('Congratulations! You have completed the Client Engagement Specialist Training Program!');
        this.closeTrainingModal();
        
        // Show completion message
        const completionHTML = `
            <div style="text-align: center; padding: 2rem; background: linear-gradient(135deg, #10b981, #059669); color: white; border-radius: 12px; margin: 2rem 0;">
                <h2>🎉 Training Completed!</h2>
                <p>You're now ready to excel as a Client Engagement Specialist at Badger Technologies!</p>
                <p>Start applying your new skills and begin building relationships with potential clients.</p>
                <a href="../sales-toolkit/" class="btn" style="background: white; color: #059669; margin-top: 1rem;">Access Sales Tools</a>
            </div>
        `;
        
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.innerHTML = completionHTML;
        }
    }
    
    saveTrainingProgress() {
        const progress = {
            trainingStarted: this.trainingStarted,
            currentModule: this.currentModule,
            currentLesson: this.currentLesson,
            completedModules: Array.from(this.completedModules),
            completedLessons: Array.from(this.completedLessons)
        };
        
        localStorage.setItem('badgerTechTrainingProgress', JSON.stringify(progress));
    }
    
    loadTrainingProgress() {
        const saved = localStorage.getItem('badgerTechTrainingProgress');
        if (saved) {
            const progress = JSON.parse(saved);
            this.trainingStarted = progress.trainingStarted || false;
            this.currentModule = progress.currentModule || 1;
            this.currentLesson = progress.currentLesson || 1;
            this.completedModules = new Set(progress.completedModules || []);
            this.completedLessons = new Set(progress.completedLessons || []);
            
            if (this.trainingStarted) {
                const progressSection = document.getElementById('training-progress');
                if (progressSection) {
                    progressSection.style.display = 'block';
                }
                this.updateTrainingProgressDisplay();
                this.updateTrainingModuleCards();
            }
        }
    }
}

// Training utility functions
function scrollToTrainingSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Add custom styles for training content
const trainingStyles = `
    .mission-vision {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin: 2rem 0;
    }
    
    .mission, .vision {
        padding: 1.5rem;
        border-radius: 8px;
        background: #f8fafc;
        border-left: 4px solid #3b82f6;
    }
    
    .status-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .status-item {
        padding: 1rem;
        background: #eff6ff;
        border-radius: 8px;
        border-left: 3px solid #3b82f6;
    }
    
    .service-tier {
        margin: 2rem 0;
        padding: 1.5rem;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        background: #fafafa;
    }
    
    .tier-details {
        margin-top: 1rem;
    }
    
    .industry-solutions {
        display: grid;
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .industry-item {
        padding: 1rem;
        background: #f0fdf4;
        border-radius: 8px;
        border-left: 4px solid #10b981;
    }
    
    .value-prop-main {
        text-align: center;
        font-size: 1.2rem;
        padding: 2rem;
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        color: white;
        border-radius: 12px;
        margin: 2rem 0;
    }
    
    .advantage-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
        margin: 2rem 0;
    }
    
    .advantage-item {
        padding: 1.5rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        border-left: 4px solid #10b981;
    }
    
    .roi-messaging {
        background: #ecfdf5;
        padding: 1.5rem;
        border-radius: 8px;
        margin: 1rem 0;
    }
    
    .objection-response {
        margin: 2rem 0;
        padding: 1.5rem;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        background: #fafafa;
    }
    
    .objection-response h4 {
        color: #dc2626;
        margin-bottom: 1rem;
    }
    
    .response {
        background: white;
        padding: 1rem;
        border-radius: 6px;
        border-left: 4px solid #3b82f6;
    }
    
    .best-practices {
        background: #fffbeb;
        padding: 1.5rem;
        border-radius: 8px;
        border-left: 4px solid #f59e0b;
        margin: 1rem 0;
    }
    
    .lesson-key-takeaway,
    .lesson-practice,
    .lesson-challenge,
    .lesson-roleplay {
        margin: 1.5rem 0;
        padding: 1rem;
        border-radius: 8px;
    }
    
    .lesson-key-takeaway {
        background: #eff6ff;
        border-left: 4px solid #3b82f6;
    }
    
    .lesson-practice {
        background: #fef3c7;
        border-left: 4px solid #f59e0b;
    }
    
    .lesson-challenge {
        background: #f3e8ff;
        border-left: 4px solid #8b5cf6;
    }
    
    .lesson-roleplay {
        background: #ecfdf5;
        border-left: 4px solid #10b981;
    }
    
    .tools-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-top: 3rem;
    }
    
    .tool-card {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        border: 1px solid #e5e7eb;
        transition: all 0.3s ease;
    }
    
    .tool-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }
    
    .tool-icon {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
    }
    
    .goals-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-top: 3rem;
    }
    
    .goal-card {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        border: 1px solid #e5e7eb;
    }
    
    .goal-metrics {
        display: grid;
        gap: 1rem;
    }
    
    .metric {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 8px;
    }
    
    .metric-number {
        font-size: 1.5rem;
        font-weight: 700;
        color: #3b82f6;
    }
    
    .quality-metrics {
        display: grid;
        gap: 0.5rem;
    }
    
    .quality-item {
        display: flex;
        justify-content: space-between;
        padding: 0.75rem;
        border-bottom: 1px solid #e5e7eb;
    }
    
    .quality-target {
        font-weight: 600;
        color: #10b981;
    }
    
    .revenue-targets {
        display: grid;
        gap: 1rem;
    }
    
    .revenue-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #f0fdf4;
        border-radius: 8px;
    }
    
    .revenue-amount {
        font-weight: 700;
        color: #10b981;
        font-size: 1.1rem;
    }
    
    .revenue-note {
        text-align: center;
        margin-top: 1rem;
        color: #6b7280;
    }
    
    @media (max-width: 768px) {
        .mission-vision {
            grid-template-columns: 1fr;
        }
        
        .advantage-grid {
            grid-template-columns: 1fr;
        }
    }
`;

// Inject training styles
const trainingStyleSheet = document.createElement('style');
trainingStyleSheet.textContent = trainingStyles;
document.head.appendChild(trainingStyleSheet);

// Initialize training when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.trainingManager = new TrainingManager();
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('trainingModal');
        if (event.target === modal) {
            window.trainingManager.closeTrainingModal();
        }
    };
    
    // Handle escape key to close modal
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            window.trainingManager.closeTrainingModal();
        }
    });
});

// Scroll to training overview when clicking "View Program"
document.addEventListener('click', function(e) {
    if (e.target.getAttribute('href') === '#training-overview') {
        e.preventDefault();
        scrollToTrainingSection('training-overview');
    }
});