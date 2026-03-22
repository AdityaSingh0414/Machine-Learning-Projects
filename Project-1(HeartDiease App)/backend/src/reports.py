from fpdf import FPDF
import io

class ClinicalReport(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 15)
        self.cell(0, 10, 'HeartWise PRO - Clinical Diagnostic Report', 0, 1, 'C')
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

def generate_pdf_report(data):
    """
    Generates a professional clinical PDF report.
    """
    pdf = ClinicalReport()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    
    # Patient Data Section
    pdf.set_text_color(100, 100, 100)
    pdf.cell(200, 10, txt="Diagnostic Summary", ln=True, align='L')
    pdf.ln(5)
    
    pdf.set_text_color(0, 0, 0)
    pdf.set_font("Arial", "B", 12)
    pdf.cell(100, 10, txt=f"Risk Level: {data.get('risk_level', 'N/A')}", ln=True)
    pdf.cell(100, 10, txt=f"Probability Score: {data.get('probability', 0)*100:.1f}%", ln=True)
    pdf.ln(10)
    
    # Insights Section
    pdf.set_font("Arial", "B", 12)
    pdf.cell(0, 10, txt="Clinical Interpretation:", ln=True)
    pdf.set_font("Arial", size=10)
    pdf.multi_cell(0, 5, txt=data.get('insights', '').get('similar_cases_stat', ''))
    pdf.ln(10)
    
    # Recommendations
    pdf.set_font("Arial", "B", 12)
    pdf.cell(0, 10, txt="Clinical Recommendations:", ln=True)
    pdf.set_font("Arial", size=10)
    for rec in data.get('insights', {}).get('lifestyle_recommendations', []):
        pdf.cell(0, 8, txt=f"- {rec}", ln=True)
    
    # Save as bytes
    return pdf.output(dest='S')
