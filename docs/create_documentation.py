from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.style import WD_STYLE_TYPE
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    ListFlowable, ListItem,
)


OUTPUT_DIR = Path(__file__).parent / "entregables"
DOCX_PATH = OUTPUT_DIR / "Actualizacion_medio_de_aporte_documentacion.docx"
PDF_PATH = OUTPUT_DIR / "Actualizacion_medio_de_aporte_documentacion.pdf"


def shade(cell, color):
    properties = cell._tc.get_or_add_tcPr()
    shading = OxmlElement("w:shd")
    shading.set(qn("w:fill"), color)
    properties.append(shading)


def set_cell_margins(cell, top=90, start=110, bottom=90, end=110):
    tc = cell._tc
    tc_pr = tc.get_or_add_tcPr()
    margins = tc_pr.first_child_found_in("w:tcMar")
    if margins is None:
        margins = OxmlElement("w:tcMar")
        tc_pr.append(margins)
    for side, value in (("top", top), ("start", start), ("bottom", bottom), ("end", end)):
        element = margins.find(qn(f"w:{side}"))
        if element is None:
            element = OxmlElement(f"w:{side}")
            margins.append(element)
        element.set(qn("w:w"), str(value))
        element.set(qn("w:type"), "dxa")


def add_table(document, headers, rows, widths=None):
    table = document.add_table(rows=1, cols=len(headers))
    table.style = "Table Grid"
    table.autofit = False
    header_cells = table.rows[0].cells
    for i, text in enumerate(headers):
        cell = header_cells[i]
        cell.text = text
        shade(cell, "3B4652")
        for run in cell.paragraphs[0].runs:
            run.font.color.rgb = RGBColor(255, 255, 255)
            run.font.bold = True
            run.font.size = Pt(9)
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        set_cell_margins(cell)
        if widths:
            cell.width = widths[i]
    for row_index, row in enumerate(rows):
        cells = table.add_row().cells
        for i, text in enumerate(row):
            cell = cells[i]
            cell.text = str(text)
            if row_index % 2 == 1:
                shade(cell, "F2F5F7")
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            set_cell_margins(cell)
            for paragraph in cell.paragraphs:
                for run in paragraph.runs:
                    run.font.size = Pt(9)
            if widths:
                cell.width = widths[i]
    document.add_paragraph()
    return table


def add_bullets(document, values):
    for value in values:
        document.add_paragraph(value, style="List Bullet")


def add_numbered(document, values):
    for value in values:
        document.add_paragraph(value, style="List Number")


def add_heading(document, text, level=1):
    document.add_heading(text, level=level)


def add_footer(section):
    footer = section.footer
    paragraph = footer.paragraphs[0]
    paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = paragraph.add_run("AFP Atlántida | Actualización de medio de aporte")
    run.font.size = Pt(8)
    run.font.color.rgb = RGBColor(90, 90, 90)


def configure(document):
    section = document.sections[0]
    section.top_margin = Cm(2.1)
    section.bottom_margin = Cm(2.0)
    section.left_margin = Cm(2.15)
    section.right_margin = Cm(2.15)
    add_footer(section)
    styles = document.styles
    normal = styles["Normal"]
    normal.font.name = "Arial"
    normal._element.rPr.rFonts.set(qn("w:eastAsia"), "Arial")
    normal.font.size = Pt(10.5)
    normal.paragraph_format.space_after = Pt(7)
    for name, size in (("Title", 22), ("Heading 1", 15), ("Heading 2", 12)):
        style = styles[name]
        style.font.name = "Arial"
        style._element.rPr.rFonts.set(qn("w:eastAsia"), "Arial")
        style.font.size = Pt(size)
        style.font.color.rgb = RGBColor(0, 0, 0)
        style.font.bold = True
    styles["Heading 1"].paragraph_format.space_before = Pt(16)
    styles["Heading 1"].paragraph_format.space_after = Pt(8)
    styles["Heading 2"].paragraph_format.space_before = Pt(11)
    styles["Heading 2"].paragraph_format.space_after = Pt(5)


def build():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    document = Document()
    configure(document)

    title = document.add_paragraph(style="Title")
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title.add_run("Actualización de medio de aporte")
    subtitle = document.add_paragraph()
    subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = subtitle.add_run("Guía de usuario y documentación técnica")
    run.font.size = Pt(13)
    run.font.bold = True
    document.add_paragraph()
    intro = document.add_paragraph()
    intro.add_run("Propósito. ").bold = True
    intro.add_run(
        "Este documento explica cómo utilizar el formulario de actualización de medio de aporte y describe los elementos técnicos necesarios para su operación y mantenimiento."
    )
    document.add_paragraph()

    add_heading(document, "Guía de usuario", 1)
    add_heading(document, "Antes de iniciar", 2)
    document.add_paragraph(
        "El enlace recibido es personal y tiene una vigencia limitada. No debe compartirse. Tenga disponible la información de la tarjeta o de la cuenta de ahorro que utilizará para el débito."
    )
    add_heading(document, "Registrar un medio de pago", 2)
    add_numbered(document, [
        "Abra el enlace recibido y espere mientras se valida la sesión y se cargan las cuentas.",
        "Si se solicita validación de identidad, complétela antes de continuar.",
        "En Selecciona tu cuenta, elija la cuenta AFP a la que se asociará el aporte.",
        "Seleccione Agregar método de pago o Agregar otra tarjeta.",
        "En Método de pago, seleccione Tarjeta de crédito o débito o Cuenta de ahorro.",
        "Complete los datos solicitados, pulse Ingresar y confirme el registro.",
    ])
    add_heading(document, "Datos por método de pago", 2)
    add_table(document, ["Método", "Datos solicitados"], [
        ["Tarjeta de crédito o débito", "Número de tarjeta, vencimiento, banco emisor, monto, frecuencia y día de débito."],
        ["Cuenta de ahorro", "Cuenta de ahorro, frecuencia del aporte y día de débito. No solicita datos de tarjeta ni monto."],
    ], [Cm(4.5), Cm(11.0)])
    add_heading(document, "Reglas importantes", 2)
    add_bullets(document, [
        "Solo se permiten tarjetas Visa o MasterCard válidas y vigentes.",
        "Para tarjetas, el monto debe cumplir el mínimo definido para la moneda de la cuenta.",
        "Mensual registra un aporte recurrente y Único registra un aporte de una sola vez.",
        "Si el día de débito ya pasó en el mes, el sistema informa que se realizará el mes siguiente.",
        "La lista de métodos no muestra el número completo de las tarjetas.",
    ])
    add_heading(document, "Administrar registros", 2)
    document.add_paragraph(
        "La sección Tus métodos de pago permite editar los datos disponibles de un registro o eliminarlo después de confirmar la acción. No cierre la página mientras se procesa un registro, edición o eliminación."
    )
    add_heading(document, "Problemas frecuentes", 2)
    add_table(document, ["Situación", "Acción recomendada"], [
        ["El enlace expiró", "Abra nuevamente el enlace original. Si aparece Solicitar Formulario, úselo o contacte a soporte."],
        ["No aparecen cuentas", "Actualice la página una vez. Si el problema continúa, use un enlace vigente o contacte a soporte."],
        ["No se registra la tarjeta", "Verifique número, fecha de vencimiento, banco emisor y monto mínimo."],
        ["No se registra la cuenta de ahorro", "Verifique que seleccionó una cuenta de ahorro y vuelva a intentarlo."],
        ["Falla la validación de identidad", "Complete nuevamente el proceso mostrado en pantalla."],
    ], [Cm(5.0), Cm(10.5)])

    document.add_page_break()
    add_heading(document, "Documentación técnica", 1)
    add_heading(document, "Alcance y tecnologías", 2)
    document.add_paragraph(
        "La aplicación es un frontend React que administra medios de aporte mediante un enlace de sesión. Permite consultar productos y medios registrados, registrar un medio, actualizarlo o desactivarlo según las capacidades del backend."
    )
    add_table(document, ["Área", "Tecnología"], [
        ["Interfaz", "React 18, TypeScript y Material UI 5"],
        ["Datos", "Axios"],
        ["Formato y máscaras", "react-number-format y react-imask"],
        ["Identidad", "SDK Veriff"],
        ["Construcción", "Create React App 5"],
    ], [Cm(5.0), Cm(10.5)])
    add_heading(document, "Arquitectura", 2)
    document.add_paragraph("El flujo principal se organiza de la siguiente forma:")
    add_bullets(document, [
        "App inicializa FormProvider, valida la sesión, carga productos y muestra Form1.",
        "Form1 concentra el formulario, las validaciones, el registro y la consulta de medios existentes.",
        "FormContext mantiene el estado compartido, incluidos metodoPago y cuentaAhorro.",
        "GetDatosClientes centraliza los clientes Axios y las funciones de integración.",
        "Los hooks encapsulan validación de sesión, productos, consulta de registros, edición y eliminación.",
    ])
    add_table(document, ["Archivo", "Responsabilidad"], [
        ["src/App.tsx", "Proveedores, sesión, carga de cuentas y pantalla principal."],
        ["src/Components/Form1.tsx", "Formulario, validaciones y registro de tarjeta o cuenta de ahorro."],
        ["src/Context/FormContext.tsx", "Estado global y contrato FormData."],
        ["src/Data/GetDatosClientes.tsx", "Instancias Axios e integraciones con el BFF."],
        ["src/Hooks/UseValidateTk.tsx", "Canje del código URL y validación de sesión."],
        ["src/Hooks/UseProductosCliente.tsx", "Carga y adaptación de cuentas del cliente."],
    ], [Cm(6.2), Cm(9.3)])
    add_heading(document, "Flujo de sesión y datos", 2)
    add_numbered(document, [
        "useValidateToken lee code o id de la URL y valida la sesión actual.",
        "Si no existe una sesión válida, exchangeCodeOnce canjea el código por cookies de sesión.",
        "Para el canal Link, la interfaz solicita validación Veriff antes de mostrar el formulario.",
        "useProductos obtiene las cuentas; useExtractRawData consulta los medios de la cuenta elegida.",
        "El alta se envía al endpoint POST. La edición y la baja se envían al endpoint de actualización.",
    ])

    add_heading(document, "Contrato de medios de pago", 2)
    add_table(document, ["Método", "Comportamiento del frontend"], [
        ["Tarjeta", "Valida marca y vencimiento. Cifra Tarjeta y Vencimiento con public.pem; envía EncryptedPayload y TipoDebito TC."],
        ["Cuenta de ahorro", "Solicita cuenta, frecuencia y día. Envía TipoDebito CA, usa el campo heredado Tarjeta para la cuenta y Monto 0."],
    ], [Cm(4.5), Cm(11.0)])
    document.add_paragraph(
        "Nota técnica. Tarjeta y Monto son nombres heredados del endpoint. El backend debe confirmar que acepta TipoDebito CA, el número de cuenta en Tarjeta y el monto cero. La evolución recomendada es incorporar un campo explícito CuentaDebito."
    )
    add_heading(document, "Variables de entorno", 2)
    add_table(document, ["Variable", "Uso"], [
        ["REACT_APP_API_TOKEN", "Validación de sesión."],
        ["REACT_APP_API_TK", "Canje del código del enlace."],
        ["REACT_APP_API_CLIENTE", "Datos del cliente."],
        ["REACT_APP_API_PRODUCTOS", "Productos y cuentas del cliente."],
        ["REACT_APP_API_GET", "Consulta de medios registrados."],
        ["REACT_APP_API_POST", "Registro de medio de pago."],
        ["REACT_APP_API_UPD", "Actualización o desactivación."],
        ["REACT_APP_API_VERIFF", "Inicio de validación Veriff."],
        ["REACT_APP_API_WHOOK", "Estado Veriff y solicitud de formulario."],
        ["REACT_APP_API_LGT", "Cierre de sesión."],
        ["REACT_APP_API_SECRET_KEY", "Encabezado x-api-key del BFF."],
    ], [Cm(6.4), Cm(9.1)])
    add_heading(document, "Seguridad y mantenimiento", 2)
    add_bullets(document, [
        "Las llamadas usan withCredentials; el BFF debe restringir CORS y cookies al dominio autorizado.",
        "No se deben registrar en consola tarjetas, cuentas, tokens ni cuerpos de solicitud.",
        "Las variables REACT_APP se incluyen en el bundle. La autorización sensible debe aplicarse en el BFF y mediante la sesión.",
        "Antes de entregar cambios, ejecute npx tsc --noEmit, npm test -- --watchAll=false y npm run build.",
        "Pruebe manualmente ambos métodos, los mensajes de error y la expiración de sesión.",
    ])
    add_heading(document, "Limitaciones conocidas", 2)
    add_bullets(document, [
        "El grid y EditDialog se diseñaron inicialmente para tarjetas; la edición específica de cuentas de ahorro requiere adaptación adicional.",
        "El frontend no recibe una clasificación explícita de cuenta de ahorro. Si la API retorna otros productos, debe exponer un atributo de tipo para filtrarlos.",
        "Create React App está en mantenimiento; una futura modernización puede evaluar Vite u otro empaquetador aprobado.",
    ])

    document.save(DOCX_PATH)
    build_pdf()
    print(DOCX_PATH)
    print(PDF_PATH)


def build_pdf():
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="DocTitle", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=21, leading=26, alignment=TA_CENTER, textColor=colors.black, spaceAfter=7))
    styles.add(ParagraphStyle(name="DocSubtitle", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=12, leading=16, alignment=TA_CENTER, spaceAfter=16))
    styles.add(ParagraphStyle(name="Body", parent=styles["BodyText"], fontName="Helvetica", fontSize=9.8, leading=14, spaceAfter=7))
    styles.add(ParagraphStyle(name="H1", parent=styles["Heading1"], fontName="Helvetica-Bold", fontSize=15, leading=19, textColor=colors.black, spaceBefore=14, spaceAfter=7))
    styles.add(ParagraphStyle(name="H2", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=11.5, leading=15, textColor=colors.black, spaceBefore=10, spaceAfter=5))
    story = []
    P = lambda text, style="Body": Paragraph(text, styles[style])
    def bullets(items):
        story.append(ListFlowable([ListItem(P(item), leftIndent=10) for item in items], bulletType="bullet", leftIndent=17, bulletFontSize=7))
        story.append(Spacer(1, 5))
    def numbers(items):
        story.append(ListFlowable([ListItem(P(item)) for item in items], bulletType="1", leftIndent=28, bulletDedent=12, bulletFontSize=8))
        story.append(Spacer(1, 5))
    def table(headers, rows, widths):
        data = [[P(h, "Body") for h in headers]] + [[P(str(cell), "Body") for cell in row] for row in rows]
        t = Table(data, colWidths=widths, repeatRows=1, hAlign="LEFT")
        commands = [
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#3B4652")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#D9D9D9")),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("LEFTPADDING", (0, 0), (-1, -1), 6), ("RIGHTPADDING", (0, 0), (-1, -1), 6),
            ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ]
        for idx in range(1, len(data)):
            if idx % 2 == 0:
                commands.append(("BACKGROUND", (0, idx), (-1, idx), colors.HexColor("#F2F5F7")))
        t.setStyle(TableStyle(commands))
        story.extend([t, Spacer(1, 9)])
    story.extend([P("Actualización de medio de aporte", "DocTitle"), P("Guía de usuario y documentación técnica", "DocSubtitle"), P("<b>Propósito.</b> Este documento explica cómo utilizar el formulario de actualización de medio de aporte y describe los elementos técnicos necesarios para su operación y mantenimiento."), Spacer(1, 7)])
    story.append(P("Guía de usuario", "H1")); story.append(P("Antes de iniciar", "H2")); story.append(P("El enlace recibido es personal y tiene una vigencia limitada. No debe compartirse. Tenga disponible la información de la tarjeta o de la cuenta de ahorro que utilizará para el débito."))
    story.append(P("Registrar un medio de pago", "H2")); numbers(["Abra el enlace recibido y espere mientras se valida la sesión y se cargan las cuentas.", "Si se solicita validación de identidad, complétela antes de continuar.", "En Selecciona tu cuenta, elija la cuenta AFP a la que se asociará el aporte.", "Seleccione Agregar método de pago o Agregar otra tarjeta.", "En Método de pago, seleccione Tarjeta de crédito o débito o Cuenta de ahorro.", "Complete los datos solicitados, pulse Ingresar y confirme el registro."])
    story.append(P("Datos por método de pago", "H2")); table(["Método", "Datos solicitados"], [["Tarjeta de crédito o débito", "Número de tarjeta, vencimiento, banco emisor, monto, frecuencia y día de débito."], ["Cuenta de ahorro", "Cuenta de ahorro, frecuencia del aporte y día de débito. No solicita datos de tarjeta ni monto."]], [4.4*cm, 11.2*cm])
    story.append(P("Reglas importantes", "H2")); bullets(["Solo se permiten tarjetas Visa o MasterCard válidas y vigentes.", "Para tarjetas, el monto debe cumplir el mínimo definido para la moneda de la cuenta.", "Mensual registra un aporte recurrente y Único registra un aporte de una sola vez.", "Si el día de débito ya pasó en el mes, el sistema informa que se realizará el mes siguiente.", "La lista de métodos no muestra el número completo de las tarjetas."])
    story.append(P("Administrar registros", "H2")); story.append(P("La sección Tus métodos de pago permite editar los datos disponibles de un registro o eliminarlo después de confirmar la acción. No cierre la página mientras se procesa un registro, edición o eliminación."))
    story.append(P("Problemas frecuentes", "H2")); table(["Situación", "Acción recomendada"], [["El enlace expiró", "Abra nuevamente el enlace original. Si aparece Solicitar Formulario, úselo o contacte a soporte."], ["No aparecen cuentas", "Actualice la página una vez. Si el problema continúa, use un enlace vigente o contacte a soporte."], ["No se registra la tarjeta", "Verifique número, fecha de vencimiento, banco emisor y monto mínimo."], ["No se registra la cuenta de ahorro", "Verifique que seleccionó una cuenta de ahorro y vuelva a intentarlo."], ["Falla la validación de identidad", "Complete nuevamente el proceso mostrado en pantalla."]], [5.0*cm, 10.6*cm])
    story.append(Spacer(1, 8))
    story.append(P("Documentación técnica", "H1")); story.append(P("Alcance y tecnologías", "H2")); story.append(P("La aplicación es un frontend React que administra medios de aporte mediante un enlace de sesión. Permite consultar productos y medios registrados, registrar un medio, actualizarlo o desactivarlo según las capacidades del backend."))
    table(["Área", "Tecnología"], [["Interfaz", "React 18, TypeScript y Material UI 5"], ["Datos", "Axios"], ["Formato y máscaras", "react-number-format y react-imask"], ["Identidad", "SDK Veriff"], ["Construcción", "Create React App 5"]], [5.0*cm, 10.6*cm])
    story.append(P("Arquitectura", "H2")); bullets(["App inicializa FormProvider, valida la sesión, carga productos y muestra Form1.", "Form1 concentra el formulario, las validaciones, el registro y la consulta de medios existentes.", "FormContext mantiene el estado compartido, incluidos metodoPago y cuentaAhorro.", "GetDatosClientes centraliza los clientes Axios y las funciones de integración.", "Los hooks encapsulan validación de sesión, productos, consulta de registros, edición y eliminación."])
    table(["Archivo", "Responsabilidad"], [["src/App.tsx", "Proveedores, sesión, carga de cuentas y pantalla principal."], ["src/Components/Form1.tsx", "Formulario, validaciones y registro de tarjeta o cuenta de ahorro."], ["src/Context/FormContext.tsx", "Estado global y contrato FormData."], ["src/Data/GetDatosClientes.tsx", "Instancias Axios e integraciones con el BFF."], ["src/Hooks/UseValidateTk.tsx", "Canje del código URL y validación de sesión."], ["src/Hooks/UseProductosCliente.tsx", "Carga y adaptación de cuentas del cliente."]], [6.1*cm, 9.5*cm])
    story.append(P("Flujo de sesión y datos", "H2")); numbers(["useValidateToken lee code o id de la URL y valida la sesión actual.", "Si no existe una sesión válida, exchangeCodeOnce canjea el código por cookies de sesión.", "Para el canal Link, la interfaz solicita validación Veriff antes de mostrar el formulario.", "useProductos obtiene las cuentas; useExtractRawData consulta los medios de la cuenta elegida.", "El alta se envía al endpoint POST. La edición y la baja se envían al endpoint de actualización."])
    story.append(P("Contrato de medios de pago", "H2")); table(["Método", "Comportamiento del frontend"], [["Tarjeta", "Valida marca y vencimiento. Cifra Tarjeta y Vencimiento con public.pem; envía EncryptedPayload y TipoDebito TC."], ["Cuenta de ahorro", "Solicita cuenta, frecuencia y día. Envía TipoDebito CA, usa el campo heredado Tarjeta para la cuenta y Monto 0."]], [4.5*cm, 11.1*cm])
    story.append(P("<b>Nota técnica.</b> Tarjeta y Monto son nombres heredados del endpoint. El backend debe confirmar que acepta TipoDebito CA, el número de cuenta en Tarjeta y el monto cero. La evolución recomendada es incorporar un campo explícito CuentaDebito."))
    story.append(P("Variables de entorno", "H2")); table(["Variable", "Uso"], [["REACT_APP_API_TOKEN", "Validación de sesión."], ["REACT_APP_API_TK", "Canje del código del enlace."], ["REACT_APP_API_CLIENTE", "Datos del cliente."], ["REACT_APP_API_PRODUCTOS", "Productos y cuentas del cliente."], ["REACT_APP_API_GET", "Consulta de medios registrados."], ["REACT_APP_API_POST", "Registro de medio de pago."], ["REACT_APP_API_UPD", "Actualización o desactivación."], ["REACT_APP_API_VERIFF", "Inicio de validación Veriff."], ["REACT_APP_API_WHOOK", "Estado Veriff y solicitud de formulario."], ["REACT_APP_API_LGT", "Cierre de sesión."], ["REACT_APP_API_SECRET_KEY", "Encabezado x-api-key del BFF."]], [6.4*cm, 9.2*cm])
    story.append(P("Seguridad y mantenimiento", "H2")); bullets(["Las llamadas usan withCredentials; el BFF debe restringir CORS y cookies al dominio autorizado.", "No se deben registrar en consola tarjetas, cuentas, tokens ni cuerpos de solicitud.", "Las variables REACT_APP se incluyen en el bundle. La autorización sensible debe aplicarse en el BFF y mediante la sesión.", "Antes de entregar cambios, ejecute npx tsc --noEmit, npm test -- --watchAll=false y npm run build.", "Pruebe manualmente ambos métodos, los mensajes de error y la expiración de sesión."])
    story.append(P("Limitaciones conocidas", "H2")); bullets(["El grid y EditDialog se diseñaron inicialmente para tarjetas; la edición específica de cuentas de ahorro requiere adaptación adicional.", "El frontend no recibe una clasificación explícita de cuenta de ahorro. Si la API retorna otros productos, debe exponer un atributo de tipo para filtrarlos.", "Create React App está en mantenimiento; una futura modernización puede evaluar Vite u otro empaquetador aprobado."])
    def footer(canvas, doc):
        canvas.saveState(); canvas.setFont("Helvetica", 8); canvas.setFillColor(colors.HexColor("#5A5A5A")); canvas.drawCentredString(A4[0] / 2, 1.1*cm, "AFP Atlántida | Actualización de medio de aporte"); canvas.restoreState()
    pdf = SimpleDocTemplate(str(PDF_PATH), pagesize=A4, rightMargin=2.15*cm, leftMargin=2.15*cm, topMargin=2.1*cm, bottomMargin=2.0*cm)
    pdf.build(story, onFirstPage=footer, onLaterPages=footer)


if __name__ == "__main__":
    build()
