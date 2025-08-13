import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Project, BudgetEntry, BudgetCode, User } from '../types';
import { formatMYR } from '../utils/currency';
import { formatDate } from '../utils/date';

export interface ReportData {
  projects: Project[];
  budgetEntries: BudgetEntry[];
  budgetCodes: BudgetCode[];
  users: User[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export class PDFReportGenerator {
  private doc: jsPDF;
  private pageHeight: number;
  private currentY: number;
  private margin: number = 20;

  constructor() {
    this.doc = new jsPDF();
    this.pageHeight = this.doc.internal.pageSize.height;
    this.currentY = this.margin;
  }

  private addHeader(title: string, subtitle?: string) {
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin, this.currentY);
    this.currentY += 10;

    if (subtitle) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(subtitle, this.margin, this.currentY);
      this.currentY += 8;
    }

    // Add date
    this.doc.setFontSize(10);
    this.doc.text(`Generated on: ${formatDate(new Date().toISOString(), 'DD/MM/YYYY')}`, this.margin, this.currentY);
    this.currentY += 15;
  }

  private checkPageBreak(requiredSpace: number = 30) {
    if (this.currentY + requiredSpace > this.pageHeight - this.margin) {
      this.doc.addPage();
      this.currentY = this.margin;
    }
  }

  private addSection(title: string) {
    this.checkPageBreak(20);
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin, this.currentY);
    this.currentY += 10;
  }

  generateProjectReport(data: ReportData): void {
    this.addHeader('Project Budget Report', 'Comprehensive Project and Budget Analysis');

    // Executive Summary
    this.addSection('Executive Summary');
    const totalProjectBudget = data.projects.reduce((sum, p) => sum + p.budget, 0);
    const totalProjectSpent = data.projects.reduce((sum, p) => sum + p.spent, 0);
    const totalBudgetCodeBudget = data.budgetCodes.reduce((sum, bc) => sum + bc.budget, 0);
    const totalBudgetCodeSpent = data.budgetCodes.reduce((sum, bc) => sum + bc.spent, 0);

    const summaryData = [
      ['Total Project Budget', formatMYR(totalProjectBudget)],
      ['Total Project Spent', formatMYR(totalProjectSpent)],
      ['Project Budget Remaining', formatMYR(totalProjectBudget - totalProjectSpent)],
      ['', ''],
      ['Total Budget Code Allocation', formatMYR(totalBudgetCodeBudget)],
      ['Total Budget Code Spent', formatMYR(totalBudgetCodeSpent)],
      ['Budget Code Remaining', formatMYR(totalBudgetCodeBudget - totalBudgetCodeSpent)],
    ];

    autoTable(this.doc, {
      startY: this.currentY,
      head: [['Metric', 'Amount (MYR)']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: this.margin, right: this.margin },
    });

    this.currentY = (this.doc as any).lastAutoTable.finalY + 15;

    // Projects Overview
    this.addSection('Projects Overview');
    const projectData = data.projects.map(project => [
      project.name,
      project.status.replace('_', ' ').toUpperCase(),
      project.priority.toUpperCase(),
      formatMYR(project.budget),
      formatMYR(project.spent),
      formatMYR(project.budget - project.spent),
      `${((project.spent / project.budget) * 100).toFixed(1)}%`
    ]);

    autoTable(this.doc, {
      startY: this.currentY,
      head: [['Project Name', 'Status', 'Priority', 'Budget', 'Spent', 'Remaining', 'Usage %']],
      body: projectData,
      theme: 'striped',
      headStyles: { fillColor: [34, 197, 94] },
      margin: { left: this.margin, right: this.margin },
      styles: { fontSize: 8 },
    });

    this.currentY = (this.doc as any).lastAutoTable.finalY + 15;

    // Budget Codes Overview
    this.addSection('Budget Codes Overview');
    const budgetCodeData = data.budgetCodes.map(code => [
      code.code,
      code.name,
      code.isActive ? 'Active' : 'Inactive',
      formatMYR(code.budget),
      formatMYR(code.spent),
      formatMYR(code.budget - code.spent),
      `${((code.spent / code.budget) * 100).toFixed(1)}%`
    ]);

    autoTable(this.doc, {
      startY: this.currentY,
      head: [['Code', 'Name', 'Status', 'Budget', 'Spent', 'Remaining', 'Usage %']],
      body: budgetCodeData,
      theme: 'striped',
      headStyles: { fillColor: [147, 51, 234] },
      margin: { left: this.margin, right: this.margin },
      styles: { fontSize: 8 },
    });

    this.currentY = (this.doc as any).lastAutoTable.finalY + 15;

    // Recent Transactions
    this.addSection('Recent Budget Entries');
    const recentEntries = data.budgetEntries
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 20);

    const entryData = recentEntries.map(entry => {
      const project = data.projects.find(p => p.id === entry.projectId);
      const budgetCode = data.budgetCodes.find(bc => bc.id === entry.budgetCodeId);
      return [
        formatDate(entry.date, 'DD/MM/YYYY'),
        project?.name || 'Unknown Project',
        budgetCode?.code || 'No Code',
        entry.description,
        entry.category,
        entry.type.toUpperCase(),
        formatMYR(entry.amount)
      ];
    });

    autoTable(this.doc, {
      startY: this.currentY,
      head: [['Date', 'Project', 'Budget Code', 'Description', 'Category', 'Type', 'Amount']],
      body: entryData,
      theme: 'striped',
      headStyles: { fillColor: [239, 68, 68] },
      margin: { left: this.margin, right: this.margin },
      styles: { fontSize: 7 },
    });
  }

  generateBudgetCodeReport(data: ReportData): void {
    this.addHeader('Budget Code Analysis Report', 'Detailed Budget Code Performance and Usage');

    // Budget Code Summary
    this.addSection('Budget Code Performance Summary');
    
    data.budgetCodes.forEach((code, index) => {
      if (index > 0) this.checkPageBreak(60);
      
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`${code.code} - ${code.name}`, this.margin, this.currentY);
      this.currentY += 8;

      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(`Description: ${code.description}`, this.margin, this.currentY);
      this.currentY += 6;

      const usagePercentage = (code.spent / code.budget) * 100;
      const codeEntries = data.budgetEntries.filter(e => e.budgetCodeId === code.id);

      const codeData = [
        ['Allocated Budget', formatMYR(code.budget)],
        ['Amount Spent', formatMYR(code.spent)],
        ['Remaining Budget', formatMYR(code.budget - code.spent)],
        ['Usage Percentage', `${usagePercentage.toFixed(1)}%`],
        ['Number of Transactions', codeEntries.length.toString()],
        ['Status', code.isActive ? 'Active' : 'Inactive']
      ];

      autoTable(this.doc, {
        startY: this.currentY,
        head: [['Metric', 'Value']],
        body: codeData,
        theme: 'grid',
        headStyles: { fillColor: [147, 51, 234] },
        margin: { left: this.margin, right: this.margin },
        tableWidth: 'auto',
        columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 60 } }
      });

      this.currentY = (this.doc as any).lastAutoTable.finalY + 10;

      // Transactions for this budget code
      if (codeEntries.length > 0) {
        this.doc.setFontSize(10);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text('Recent Transactions:', this.margin, this.currentY);
        this.currentY += 6;

        const transactionData = codeEntries.slice(0, 10).map(entry => {
          const project = data.projects.find(p => p.id === entry.projectId);
          return [
            formatDate(entry.date, 'DD/MM/YYYY'),
            project?.name || 'Unknown',
            entry.description,
            entry.category,
            formatMYR(entry.amount)
          ];
        });

        autoTable(this.doc, {
          startY: this.currentY,
          head: [['Date', 'Project', 'Description', 'Category', 'Amount']],
          body: transactionData,
          theme: 'striped',
          headStyles: { fillColor: [107, 114, 128] },
          margin: { left: this.margin, right: this.margin },
          styles: { fontSize: 8 }
        });

        this.currentY = (this.doc as any).lastAutoTable.finalY + 15;
      }
    });
  }

  generateProjectDetailReport(project: Project, data: ReportData): void {
    this.addHeader(`Project Report: ${project.name}`, project.description);

    // Project Details
    this.addSection('Project Information');
    const projectData = [
      ['Project Name', project.name],
      ['Status', project.status.replace('_', ' ').toUpperCase()],
      ['Priority', project.priority.toUpperCase()],
      ['Start Date', formatDate(project.startDate, 'DD/MM/YYYY')],
      ['End Date', formatDate(project.endDate, 'DD/MM/YYYY')],
      ['Total Budget', formatMYR(project.budget)],
      ['Amount Spent', formatMYR(project.spent)],
      ['Remaining Budget', formatMYR(project.budget - project.spent)],
      ['Budget Usage', `${((project.spent / project.budget) * 100).toFixed(1)}%`]
    ];

    autoTable(this.doc, {
      startY: this.currentY,
      head: [['Field', 'Value']],
      body: projectData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: this.margin, right: this.margin },
    });

    this.currentY = (this.doc as any).lastAutoTable.finalY + 15;

    // Assigned Team Members
    this.addSection('Assigned Team Members');
    const assignedUsers = data.users.filter(user => project.assignedUsers.includes(user.id));
    const teamData = assignedUsers.map(user => [
      user.name,
      user.email,
      user.role.replace('_', ' ').toUpperCase()
    ]);

    autoTable(this.doc, {
      startY: this.currentY,
      head: [['Name', 'Email', 'Role']],
      body: teamData,
      theme: 'striped',
      headStyles: { fillColor: [34, 197, 94] },
      margin: { left: this.margin, right: this.margin },
    });

    this.currentY = (this.doc as any).lastAutoTable.finalY + 15;

    // Budget Codes
    this.addSection('Assigned Budget Codes');
    const assignedBudgetCodes = data.budgetCodes.filter(code => project.budgetCodes.includes(code.id));
    const budgetCodeData = assignedBudgetCodes.map(code => [
      code.code,
      code.name,
      formatMYR(code.budget),
      formatMYR(code.spent),
      `${((code.spent / code.budget) * 100).toFixed(1)}%`
    ]);

    autoTable(this.doc, {
      startY: this.currentY,
      head: [['Code', 'Name', 'Budget', 'Spent', 'Usage %']],
      body: budgetCodeData,
      theme: 'striped',
      headStyles: { fillColor: [147, 51, 234] },
      margin: { left: this.margin, right: this.margin },
    });

    this.currentY = (this.doc as any).lastAutoTable.finalY + 15;

    // Project Transactions
    this.addSection('Project Transactions');
    const projectEntries = data.budgetEntries.filter(entry => entry.projectId === project.id);
      const transactionData = projectEntries.map(entry => {
      const budgetCode = data.budgetCodes.find(bc => bc.id === entry.budgetCodeId);
      return [
          formatDate(entry.date, 'DD/MM/YYYY'),
        budgetCode?.code || 'No Code',
        entry.description,
        entry.category,
        entry.type.toUpperCase(),
        formatMYR(entry.amount)
      ];
    });

    autoTable(this.doc, {
      startY: this.currentY,
      head: [['Date', 'Budget Code', 'Description', 'Category', 'Type', 'Amount']],
      body: transactionData,
      theme: 'striped',
      headStyles: { fillColor: [239, 68, 68] },
      margin: { left: this.margin, right: this.margin },
      styles: { fontSize: 8 },
    });
  }

  save(filename: string): void {
    this.doc.save(filename);
  }

  getBlob(): Blob {
    return this.doc.output('blob');
  }
}

// Export functions
export const exportProjectReport = (data: ReportData) => {
  const generator = new PDFReportGenerator();
  generator.generateProjectReport(data);
  generator.save(`project-report-${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportBudgetCodeReport = (data: ReportData) => {
  const generator = new PDFReportGenerator();
  generator.generateBudgetCodeReport(data);
  generator.save(`budget-code-report-${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportProjectDetailReport = (project: Project, data: ReportData) => {
  const generator = new PDFReportGenerator();
  generator.generateProjectDetailReport(project, data);
  generator.save(`${project.name.toLowerCase().replace(/\s+/g, '-')}-report-${new Date().toISOString().split('T')[0]}.pdf`);
};