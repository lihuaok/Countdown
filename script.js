class CountdownBoard {
    constructor() {
        this.nodes = [];
        this.countdownInterval = null;
        this.timeInterval = null;
        this.isRunning = false;
        this.init();
    }

    init() {
        this.loadNodes();
        this.bindEvents();
        this.updateStatus();
    }

    loadNodes() {
        const stored = localStorage.getItem('countdownNodes');
        if (stored) {
            this.nodes = JSON.parse(stored);
        } else {
            this.nodes = this.getDefaultNodes();
            this.saveNodes();
        }
        this.render();
    }

    getDefaultNodes() {
        const currentYear = new Date().getFullYear();
        
        return [
            {
                id: 'node-1',
                name: '项目池公布',
                description: '公布项目池，供学生选择意向项目',
                deadline: new Date(currentYear, 4, 11, 23, 59, 59).toISOString(),
                completed: true
            },
            {
                id: 'node-2',
                name: '意向填报截止',
                description: '学生提交项目意向填报，确定志愿顺序',
                deadline: new Date(currentYear, 4, 13, 23, 59, 59).toISOString(),
                completed: true
            },
            {
                id: 'node-3',
                name: '最终名单锁定',
                description: '确定最终入选名单并公示',
                deadline: new Date(currentYear, 4, 15, 23, 59, 59).toISOString(),
                completed: true
            },
            {
                id: 'node-4',
                name: 'G1提案提交',
                description: '各小组提交G1阶段项目提案',
                deadline: new Date(currentYear, 4, 16, 23, 59, 59).toISOString(),
                completed: true
            },
            {
                id: 'node-5',
                name: 'G2提交自检',
                description: '各小组提交G2阶段自检报告',
                deadline: new Date(currentYear, 5, 10, 23, 59, 59).toISOString(),
                completed: false
            },
            {
                id: 'node-6',
                name: '班级成果展',
                description: '举办班级项目成果展示与评审',
                deadline: new Date(currentYear, 5, 24, 23, 59, 59).toISOString(),
                completed: false
            }
        ];
    }

    saveNodes() {
        localStorage.setItem('countdownNodes', JSON.stringify(this.nodes));
    }

    bindEvents() {
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        document.getElementById('stopBtn').addEventListener('click', () => this.stop());
    }

    start() {
        if (this.isRunning) return;
        
        this.updateCurrentTime();
        this.timeInterval = setInterval(() => this.updateCurrentTime(), 1000);
        
        this.updateCountdowns();
        this.countdownInterval = setInterval(() => this.updateCountdowns(), 1000);
        
        this.isRunning = true;
        this.updateStatus();
    }

    stop() {
        if (!this.isRunning) return;
        
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
            this.timeInterval = null;
        }
        
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
        
        this.isRunning = false;
        this.updateStatus();
    }

    updateStatus() {
        const statusElement = document.getElementById('timerStatus');
        const startBtn = document.getElementById('startBtn');
        const stopBtn = document.getElementById('stopBtn');
        const statusDot = statusElement.querySelector('.status-dot');
        const statusText = statusElement.querySelector('.status-text');
        
        if (this.isRunning) {
            statusElement.classList.add('active');
            statusText.textContent = 'RUNNING';
            startBtn.disabled = true;
            stopBtn.disabled = false;
        } else {
            statusElement.classList.remove('active');
            statusText.textContent = 'HALTED';
            startBtn.disabled = false;
            stopBtn.disabled = true;
        }
    }

    startTimers() {
        this.start();
    }

    getBeijingTime() {
        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const beijingTime = new Date(utc + 8 * 3600000);
        
        const year = beijingTime.getFullYear().toString();
        const month = String(beijingTime.getMonth() + 1).padStart(2, '0');
        const day = String(beijingTime.getDate()).padStart(2, '0');
        const hour = String(beijingTime.getHours()).padStart(2, '0');
        const minute = String(beijingTime.getMinutes()).padStart(2, '0');
        const second = String(beijingTime.getSeconds()).padStart(2, '0');
        
        const dateStr = `${year}/${month}/${day}`;
        const timeStr = `${hour}:${minute}:${second}`;
        
        return {
            date: dateStr,
            time: timeStr,
            datetime: `${dateStr} ${timeStr}`,
            timestamp: now.getTime()
        };
    }

    updateCurrentTime() {
        const beijingTime = this.getBeijingTime();
        const timeElement = document.getElementById('currentTime');
        const currentText = timeElement.textContent;
        if (currentText !== beijingTime.datetime) {
            timeElement.textContent = beijingTime.datetime;
            timeElement.setAttribute('data-time', beijingTime.datetime);
        }
    }

    getStatus(deadline, completed) {
        if (completed) return 'completed';
        
        const now = new Date().getTime();
        const deadlineTime = new Date(deadline).getTime();
        const diff = deadlineTime - now;
        
        const oneDay = 24 * 60 * 60 * 1000;
        const threeDays = 3 * oneDay;
        const sevenDays = 7 * oneDay;
        
        if (diff <= 0) return 'danger';
        if (diff <= threeDays) return 'danger';
        if (diff <= sevenDays) return 'warning';
        return 'normal';
    }

    getTimeRemaining(deadline) {
        const now = new Date().getTime();
        const deadlineTime = new Date(deadline).getTime();
        const diff = deadlineTime - now;
        
        if (diff <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        return { days, hours, minutes, seconds, total: diff };
    }

    updateCountdowns() {
        const sortedNodes = this.getSortedNodes();
        
        sortedNodes.forEach((node) => {
            const remaining = this.getTimeRemaining(node.deadline);
            const card = document.querySelector(`[data-node-id="${node.id}"]`);
            
            if (card) {
                this.updateCardCountdown(card, remaining);
                
                const newStatus = this.getStatus(node.deadline, node.completed);
                const statusElement = card.querySelector('.card-status');
                const currentStatus = statusElement?.classList.contains('normal') ? 'normal' :
                                      statusElement?.classList.contains('warning') ? 'warning' :
                                      statusElement?.classList.contains('danger') ? 'danger' : 'completed';
                
                if (newStatus !== currentStatus) {
                    this.updateCardStatus(card, newStatus);
                }
            }
        });
        
        this.renderStats();
    }

    updateCardCountdown(card, remaining) {
        const values = card.querySelectorAll('.time-number');
        const valuesArray = [remaining.days, remaining.hours, remaining.minutes, remaining.seconds];
        
        values.forEach((el, index) => {
            const oldValue = parseInt(el.textContent) || 0;
            const newValue = valuesArray[index];
            
            if (oldValue !== newValue) {
                el.classList.add('updating');
                el.textContent = String(newValue).padStart(2, '0');
                
                setTimeout(() => {
                    el.classList.remove('updating');
                }, 350);
            }
        });
    }

    updateCardStatus(card, status) {
        const statusElement = card.querySelector('.card-status');
        const statusClasses = ['normal', 'warning', 'danger', 'completed'];
        
        statusClasses.forEach(cls => {
            card.classList.remove(cls);
            statusElement?.classList.remove(cls);
        });
        
        card.classList.add(status);
        statusElement?.classList.add(status);
        
        const statusText = {
            normal: 'NORMAL',
            warning: 'WARNING',
            danger: 'DANGER',
            completed: 'COMPLETED'
        };
        statusElement.textContent = statusText[status];
    }

    getSortedNodes() {
        const priorityTasks = ['G2提交自检', '班级成果展'];
        
        const priorityNodes = this.nodes.filter(n => priorityTasks.includes(n.name));
        const normalNodes = this.nodes.filter(n => !priorityTasks.includes(n.name));
        
        priorityNodes.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        normalNodes.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        
        return [...priorityNodes, ...normalNodes];
    }



    render() {
        this.renderStats();
        this.renderTimeline();
        this.renderNodes();
    }

    renderStats() {
        const container = document.getElementById('statsContainer');
        const total = this.nodes.length;
        const warning = this.nodes.filter(n => !n.completed && this.getStatus(n.deadline, false) === 'warning').length || 1;
        const danger = this.nodes.filter(n => !n.completed && this.getStatus(n.deadline, false) === 'danger').length || 1;
        
        container.innerHTML = `
            <div class="stat-card highlight">
                <span class="stat-value" data-value="${total}">${total}</span>
                <span class="stat-label">总节点</span>
            </div>
            <div class="stat-card warning highlight">
                <span class="stat-value" data-value="${warning}">${warning}</span>
                <span class="stat-label">即将到期</span>
            </div>
            <div class="stat-card danger highlight">
                <span class="stat-value" data-value="${danger}">${danger}</span>
                <span class="stat-label">紧急</span>
            </div>
        `;
    }

    renderTimeline() {
        const container = document.getElementById('timelineContainer');
        const sortedNodes = this.getSortedNodes();
        
        container.innerHTML = sortedNodes.slice(0, 6).map((node, index) => {
            const status = this.getStatus(node.deadline, node.completed);
            const date = new Date(node.deadline);
            const dateStr = `${date.getMonth() + 1}月${date.getDate()}日`;
            
            return `
                <div class="timeline-item ${status}">
                    <div class="timeline-marker"></div>
                    <div class="timeline-date">${dateStr}</div>
                    <div class="timeline-name">${node.name}</div>
                </div>
            `;
        }).join('');
    }

    renderNodes() {
        const container = document.getElementById('cardsContainer');
        const sortedNodes = this.getSortedNodes();
        
        if (sortedNodes.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <h3>暂无项目节点</h3>
                    <p>点击右下角按钮添加第一个节点</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = sortedNodes.map((node, index) => {
            const status = this.getStatus(node.deadline, node.completed);
            const remaining = this.getTimeRemaining(node.deadline);
            const date = new Date(node.deadline);
            const deadlineStr = date.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
            const statusText = {
                normal: 'NORMAL',
                warning: 'WARNING',
                danger: 'DANGER',
                completed: 'COMPLETED'
            };
            
            return `
                <div class="milestone-card ${status}" data-node-id="${node.id}">
                    <div class="card-header">
                        <div class="card-title-block">
                            <div class="card-title">${node.name}</div>
                            <span class="card-status ${status}">${statusText[status]}</span>
                        </div>
                        <div class="card-actions">
                            <button class="action-icon" onclick="countdownBoard.toggleComplete('${node.id}')">
                                ${node.completed ? `
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                ` : `
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                `}
                            </button>
                            <button class="action-icon delete" onclick="countdownBoard.deleteNode('${node.id}')">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
                    ${node.description ? `<p class="card-description">${node.description}</p>` : ''}
                    <div class="countdown-display">
                        <div class="time-block">
                            <span class="time-number">${String(remaining.days).padStart(2, '0')}</span>
                            <span class="time-label">天</span>
                        </div>
                        <div class="time-block">
                            <span class="time-number">${String(remaining.hours).padStart(2, '0')}</span>
                            <span class="time-label">时</span>
                        </div>
                        <div class="time-block">
                            <span class="time-number">${String(remaining.minutes).padStart(2, '0')}</span>
                            <span class="time-label">分</span>
                        </div>
                        <div class="time-block seconds">
                            <span class="time-number">${String(remaining.seconds).padStart(2, '0')}</span>
                            <span class="time-label">秒</span>
                        </div>
                    </div>
                    <div class="card-footer">
                        <span class="deadline-text">截止时间: ${deadlineStr}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    toggleComplete(id) {
        const node = this.nodes.find(n => n.id === id);
        if (node) {
            node.completed = !node.completed;
            this.saveNodes();
            this.render();
        }
    }

    deleteNode(id) {
        if (confirm('确定要删除这个节点吗？')) {
            this.nodes = this.nodes.filter(n => n.id !== id);
            this.saveNodes();
            this.render();
        }
    }

    destroy() {
        if (this.countdownInterval) clearInterval(this.countdownInterval);
        if (this.timeInterval) clearInterval(this.timeInterval);
    }
}

const countdownBoard = new CountdownBoard();

window.addEventListener('beforeunload', () => {
    countdownBoard.destroy();
});