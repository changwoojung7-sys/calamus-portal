import fitz
from PIL import Image, ImageDraw, ImageFont
import io
import os

FONT_BOLD = 'C:/Windows/Fonts/malgunbd.ttf'
FONT_REGULAR = 'C:/Windows/Fonts/malgun.ttf'

def get_pil_image_from_page(page):
    xref = page.get_images()[0][0]
    base_image = page.parent.extract_image(xref)
    return Image.open(io.BytesIO(base_image['image'])).convert('RGB')

def image_to_pdf_page(doc, pno, pil_img):
    # Convert PIL Image back to JPEG/PNG bytes and replace in page
    buf = io.BytesIO()
    pil_img.save(buf, format='JPEG', quality=95)
    img_bytes = buf.getvalue()
    
    # Create a 1-page temp pdf and insert or replace
    temp_img_pdf = fitz.open()
    rect = fitz.Rect(0, 0, pil_img.width, pil_img.height)
    new_page = temp_img_pdf.new_page(width=pil_img.width, height=pil_img.height)
    new_page.insert_image(rect, stream=img_bytes)
    
    # Replace in target doc
    doc.delete_page(pno)
    doc.insert_pdf(temp_img_pdf, from_page=0, to_page=0, start_at=pno)
    temp_img_pdf.close()

print('Helper functions loaded')
