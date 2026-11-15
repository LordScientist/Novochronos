#!/usr/bin/env python3
"""
Novochronos 7-Slide Presentation Deck Generator
Generates an executive-grade 16:9 PowerPoint (.pptx) presentation
complying strictly with NASA Space Apps Challenge demonstration requirements.

Key Specifications:
- Format: Native Microsoft PowerPoint (.pptx)
- Aspect Ratio: 16:9 Widescreen (13.333" x 7.5")
- Slide Count: Exactly 7 slides
- Design System: Dark luxury aerospace theme (Obsidian, Deep Slate, Celestial Cyan, Mars Amber)
- Em Dash Policy: ZERO em dashes (strictly validated)
- Crediting: Strictly honors NASA and official NASA archives
"""

import os
import sys
import pptx
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

# ---------------------------------------------------------------------------
# COLOR PALETTE (AEROSPACE EXECUTIVE THEME)
# ---------------------------------------------------------------------------
COLOR_BG = RGBColor(9, 13, 22)             # Deep Obsidian Space (#090D16)
COLOR_CARD_BG = RGBColor(17, 24, 39)       # Deep Slate Card (#111827)
COLOR_CARD_BORDER = RGBColor(31, 41, 55)   # Subtle Slate Border (#1F2937)
COLOR_CARD_BORDER_CYAN = RGBColor(14, 116, 144) # Cyan Highlight Border (#0E7490)
COLOR_WHITE = RGBColor(255, 255, 255)      # Pure White Title (#FFFFFF)
COLOR_SLATE_LIGHT = RGBColor(241, 245, 249)# Off-White Text (#F1F5F9)
COLOR_SLATE_MUTED = RGBColor(148, 163, 184)# Muted Cool Slate (#94A3B8)
COLOR_CYAN = RGBColor(56, 189, 248)        # Celestial Cyan Accent (#38BDF8)
COLOR_AMBER = RGBColor(251, 146, 60)       # Mars Amber / Coral (#FB923C)
COLOR_GOLD = RGBColor(250, 204, 21)        # Telemetry Gold (#FACC15)
COLOR_GREEN = RGBColor(52, 211, 153)       # Verification Green (#34D399)
COLOR_CARD_INNER = RGBColor(24, 33, 53)    # Slightly lighter inner container (#182135)

FONT_HEADING = "Arial"
FONT_BODY = "Arial"
FONT_MONO = "Courier New"

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    return prs

def set_slide_background(slide):
    """Draws a full-bleed dark obsidian background rectangle to guarantee dark theme across all viewers."""
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = COLOR_BG
    bg.line.color.rgb = COLOR_BG
    return bg

def add_header(slide, eyebrow, title, subtitle):
    """Standardizes executive slide header across all slides."""
    # Eyebrow / Tag
    tb_eye = slide.shapes.add_textbox(Inches(0.8), Inches(0.45), Inches(11.733), Inches(0.3))
    tf_eye = tb_eye.text_frame
    tf_eye.word_wrap = True
    tf_eye.margin_left = tf_eye.margin_right = tf_eye.margin_top = tf_eye.margin_bottom = 0
    p_eye = tf_eye.paragraphs[0]
    p_eye.text = eyebrow.upper()
    p_eye.font.name = FONT_HEADING
    p_eye.font.size = Pt(10)
    p_eye.font.bold = True
    p_eye.font.color.rgb = COLOR_CYAN

    # Title
    tb_title = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.733), Inches(0.55))
    tf_title = tb_title.text_frame
    tf_title.word_wrap = True
    tf_title.margin_left = tf_title.margin_right = tf_title.margin_top = tf_title.margin_bottom = 0
    p_title = tf_title.paragraphs[0]
    p_title.text = title
    p_title.font.name = FONT_HEADING
    p_title.font.size = Pt(25)
    p_title.font.bold = True
    p_title.font.color.rgb = COLOR_WHITE

    # Subtitle
    tb_sub = slide.shapes.add_textbox(Inches(0.8), Inches(1.35), Inches(11.733), Inches(0.35))
    tf_sub = tb_sub.text_frame
    tf_sub.word_wrap = True
    tf_sub.margin_left = tf_sub.margin_right = tf_sub.margin_top = tf_sub.margin_bottom = 0
    p_sub = tf_sub.paragraphs[0]
    p_sub.text = subtitle
    p_sub.font.name = FONT_BODY
    p_sub.font.size = Pt(12)
    p_sub.font.color.rgb = COLOR_SLATE_MUTED

def add_footer(slide, slide_num, total_slides=7):
    """Standardizes slide footer with project identity and slide indicator."""
    # Subtle separator line
    line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(6.85), Inches(11.733), Pt(1))
    line.fill.solid()
    line.fill.fore_color.rgb = COLOR_CARD_BORDER
    line.line.color.rgb = COLOR_CARD_BORDER

    # Left text
    tb_left = slide.shapes.add_textbox(Inches(0.8), Inches(6.92), Inches(8.0), Inches(0.3))
    tf_left = tb_left.text_frame
    tf_left.word_wrap = True
    tf_left.margin_left = tf_left.margin_right = tf_left.margin_top = tf_left.margin_bottom = 0
    p_left = tf_left.paragraphs[0]
    p_left.text = "NOVOCHRONOS | NASA SPACE APPS CHALLENGE 2026 GLOBAL DEMONSTRATION"
    p_left.font.name = FONT_HEADING
    p_left.font.size = Pt(8.5)
    p_left.font.color.rgb = RGBColor(100, 116, 139)

    # Right indicator
    tb_right = slide.shapes.add_textbox(Inches(9.5), Inches(6.92), Inches(3.033), Inches(0.3))
    tf_right = tb_right.text_frame
    tf_right.word_wrap = True
    tf_right.margin_left = tf_right.margin_right = tf_right.margin_top = tf_right.margin_bottom = 0
    p_right = tf_right.paragraphs[0]
    p_right.alignment = PP_ALIGN.RIGHT
    p_right.text = f"SLIDE 0{slide_num} OF 0{total_slides}"
    p_right.font.name = FONT_HEADING
    p_right.font.size = Pt(8.5)
    p_right.font.bold = True
    p_right.font.color.rgb = COLOR_CYAN

def add_card(slide, left, top, width, height, bg_color=COLOR_CARD_BG, border_color=COLOR_CARD_BORDER, border_pt=1):
    """Creates a rounded container card for visual grouping."""
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
    card.fill.solid()
    card.fill.fore_color.rgb = bg_color
    card.line.color.rgb = border_color
    card.line.width = Pt(border_pt)
    return card

# ---------------------------------------------------------------------------
# SLIDE BUILDERS (EXACTLY 7 SLIDES)
# ---------------------------------------------------------------------------

def build_slide_1(prs):
    """Slide 1: Executive Title & Global Challenge Overview"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide)
    add_header(
        slide,
        eyebrow="NASA SPACE APPS CHALLENGE 2026 // GLOBAL DEMONSTRATION",
        title="NOVOCHRONOS: The Orbital Sentinel Archive",
        subtitle="An interactive 3D living museum preserving the physical monuments of deep space exploration."
    )
    add_footer(slide, 1)

    # Left Column: Mission Charter Card
    add_card(slide, 0.8, 1.85, 6.8, 3.55)
    tb_charter = slide.shapes.add_textbox(Inches(1.05), Inches(2.05), Inches(6.3), Inches(3.15))
    tf = tb_charter.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0

    p1 = tf.paragraphs[0]
    p1.text = "MISSION CHARTER & VALUE PROPOSITION"
    p1.font.name = FONT_HEADING
    p1.font.size = Pt(13)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_CYAN
    p1.space_after = Pt(10)

    p2 = tf.add_paragraph()
    p2.text = (
        "Over six decades, humanity has dispatched dozens of robotic explorers into interplanetary space. "
        "When power subsides and transmissions cease, their physical bodies remain silently in place as "
        "monuments to human curiosity and scientific grit."
    )
    p2.font.name = FONT_BODY
    p2.font.size = Pt(11)
    p2.font.color.rgb = COLOR_SLATE_LIGHT
    p2.space_after = Pt(8)

    p3 = tf.add_paragraph()
    p3.text = (
        "Novochronos bridges authentic NASA Planetary Data System (PDS) telemetry, high-fidelity 3D hardware models, "
        "and first-person audio archives to create an accessible, browser-native digital twin of humanity's resting sentinels."
    )
    p3.font.name = FONT_BODY
    p3.font.size = Pt(11)
    p3.font.color.rgb = COLOR_SLATE_LIGHT
    p3.space_after = Pt(12)

    # Technical badges inside card
    p4 = tf.add_paragraph()
    p4.text = "CORE STACK: Three.js | React Three Fiber | Web Audio API | Draco 3D | NASA PDS Telemetry"
    p4.font.name = FONT_MONO
    p4.font.size = Pt(9.5)
    p4.font.bold = True
    p4.font.color.rgb = COLOR_AMBER

    # Right Column: Hero Visual Card (Embedded NASA archival image)
    add_card(slide, 7.8, 1.85, 4.733, 3.55)
    img_path = "public/images/sentinels/opportunity-rover.jpg"
    if os.path.exists(img_path):
        slide.shapes.add_picture(img_path, Inches(7.95), Inches(2.0), width=Inches(4.433), height=Inches(2.75))
    
    # Caption pill
    tb_cap = slide.shapes.add_textbox(Inches(7.95), Inches(4.85), Inches(4.433), Inches(0.45))
    tf_cap = tb_cap.text_frame
    tf_cap.word_wrap = True
    tf_cap.margin_left = tf_cap.margin_right = tf_cap.margin_top = tf_cap.margin_bottom = 0
    p_cap = tf_cap.paragraphs[0]
    p_cap.text = "HISTORIC ARTIFACT: OPPORTUNITY ROVER (MER-B) // MERIDIANI PLANUM, MARS"
    p_cap.font.name = FONT_MONO
    p_cap.font.size = Pt(8.5)
    p_cap.font.bold = True
    p_cap.font.color.rgb = COLOR_CYAN

    # Bottom 4 Metric Cards
    metrics = [
        ("11 SENTINELS", "Documented Across Moon & Mars", COLOR_CYAN),
        ("60+ FPS", "Browser WebGL Flight Engine", COLOR_GREEN),
        ("100% WEB", "Zero Downloads, Installs, or Plugins", COLOR_AMBER),
        ("NASA PDS", "Authentic Telemetry & Coordinates", COLOR_GOLD)
    ]
    card_w = 2.75
    gap = 0.244
    for i, (val, lbl, color) in enumerate(metrics):
        x = 0.8 + i * (card_w + gap)
        add_card(slide, x, 5.55, card_w, 1.15)
        tb_m = slide.shapes.add_textbox(Inches(x + 0.15), Inches(5.65), Inches(card_w - 0.3), Inches(0.95))
        tf_m = tb_m.text_frame
        tf_m.word_wrap = True
        tf_m.margin_left = tf_m.margin_right = tf_m.margin_top = tf_m.margin_bottom = 0
        p_val = tf_m.paragraphs[0]
        p_val.text = val
        p_val.font.name = FONT_HEADING
        p_val.font.size = Pt(17)
        p_val.font.bold = True
        p_val.font.color.rgb = color
        p_val.space_after = Pt(2)

        p_lbl = tf_m.add_paragraph()
        p_lbl.text = lbl
        p_lbl.font.name = FONT_BODY
        p_lbl.font.size = Pt(9.5)
        p_lbl.font.color.rgb = COLOR_SLATE_MUTED

def build_slide_2(prs):
    """Slide 2: The Challenge: The Vanishing Heritage of Deep Space"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide)
    add_header(
        slide,
        eyebrow="PROBLEM STATEMENT & CHALLENGE CONTEXT",
        title="The Threat of Silent Erasure in Solar System Exploration",
        subtitle="Over six decades of robotic exploration artifacts risk being forgotten, neglected, or unprotected."
    )
    add_footer(slide, 2)

    cards_data = [
        (
            "01. DATA INACCESSIBILITY",
            "LOCKED IN SCIENTIFIC SILOS",
            COLOR_CYAN,
            [
                "Telemetry Dispersal: Vital coordinates, engineering logs, and hardware blueprints are archived across complex academic databases (NASA PDS).",
                "High Public Barrier: Without specialized planetary software, educators and students cannot easily explore or visualize raw mission findings.",
                "Flat Presentation: Public awareness is largely restricted to static 2D Wikipedia tables and disconnected image galleries."
            ],
            "Imperative: A unified, interactive visual gateway to deep space data."
        ),
        (
            "02. THE PRESERVATION CRISIS",
            "MONUMENTS ON HOSTILE WORLDS",
            COLOR_AMBER,
            [
                "Environmental Degradation: Extreme thermal cycling, solar ultraviolet radiation, and Martian dust abrasion constantly wear down dormant hardware.",
                "Commercial Exploration Risks: Rapidly expanding lunar and Martian landing programs heighten risks of unintentional contamination or physical disturbance.",
                "Absence of Baseline: No unified, open digital twin currently baselines their exact resting positions and hardware condition."
            ],
            "Imperative: Digital heritage preservation before physical sites are altered."
        ),
        (
            "03. THE EMPATHY GAP",
            "MACHINES WITH HUMAN PURPOSE",
            COLOR_GREEN,
            [
                "Emotional Disconnect: Scientific papers convey facts but fail to capture the grit, ingenuity, and teamwork behind planetary survival.",
                "Forgotten Milestones: Each probe overcame catastrophic mechanical failures to extend missions far beyond initial operational limits.",
                "Educational Erosion: Next-generation explorers risk losing emotional connection to the foundational pioneers that made Artemis and Mars possible."
            ],
            "Imperative: First-person audio narratives that bring telemetry to life."
        )
    ]

    card_w = 3.65
    gap = 0.39
    for i, (tag, subtitle, color, points, callout) in enumerate(cards_data):
        x = 0.8 + i * (card_w + gap)
        add_card(slide, x, 1.85, card_w, 4.85)
        tb = slide.shapes.add_textbox(Inches(x + 0.2), Inches(2.05), Inches(card_w - 0.4), Inches(4.45))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0

        p_tag = tf.paragraphs[0]
        p_tag.text = tag
        p_tag.font.name = FONT_HEADING
        p_tag.font.size = Pt(13)
        p_tag.font.bold = True
        p_tag.font.color.rgb = color
        p_tag.space_after = Pt(2)

        p_sub = tf.add_paragraph()
        p_sub.text = subtitle
        p_sub.font.name = FONT_MONO
        p_sub.font.size = Pt(9.5)
        p_sub.font.bold = True
        p_sub.font.color.rgb = COLOR_SLATE_MUTED
        p_sub.space_after = Pt(12)

        for pt in points:
            p_pt = tf.add_paragraph()
            p_pt.text = "• " + pt
            p_pt.font.name = FONT_BODY
            p_pt.font.size = Pt(10.5)
            p_pt.font.color.rgb = COLOR_SLATE_LIGHT
            p_pt.space_after = Pt(10)

        p_call = tf.add_paragraph()
        p_call.text = ">> " + callout
        p_call.font.name = FONT_HEADING
        p_call.font.size = Pt(10)
        p_call.font.bold = True
        p_call.font.color.rgb = color

def build_slide_3(prs):
    """Slide 3: The Novochronos Solution: 3D Living Digital Twin"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide)
    add_header(
        slide,
        eyebrow="THE NOVOCHRONOS PLATFORM // SYSTEM ARCHITECTURE",
        title="A Living 3D Digital Twin and Sensory Experience",
        subtitle="Zero-download browser architecture turning raw space telemetry into an emotional, museum-grade journey."
    )
    add_footer(slide, 3)

    pillars = [
        (
            "VISUAL PILLAR",
            "REAL-TIME 3D RECONSTRUCTION",
            COLOR_CYAN,
            [
                "Interactive 3D Hardware Orbit: 360-degree rotation, multi-angle inspection, and wireframe structural views.",
                "Atmospheric Optical Modeling: Procedural Mars Rayleigh scattering, authentic solar angles, and accurate terrain textures.",
                "NASA 3D Asset Integration: Official geometries compressed with Draco 3D geometry algorithms for instant streaming."
            ]
        ),
        (
            "AUDITORY PILLAR",
            "SPATIAL SOUND & NARRATIVE",
            COLOR_AMBER,
            [
                "First-Person Spoken Voices: Narrative accounts recounting critical mission milestones and final transmissions.",
                "Synthesized Sound Engine: Web Audio API procedural synthesis recreating Martian wind, descent pings, and pressure ambiences.",
                "Universal Text Synchronization: Real-time closed captions and transcripts ensuring complete accessibility for all users."
            ]
        ),
        (
            "TACTILE PILLAR",
            "HELICAL FLIGHT & PHYSICS",
            COLOR_GREEN,
            [
                "3D Helical Corridor: Continuous spiral camera trajectory navigated via smooth momentum scrolling and touch gestures.",
                "Real-Time Telemetry HUD: Live coordinates, mission elapsed time, battery levels, and distance traveled indicators.",
                "Interactive Arcade Simulation: Built-in POWER RUN simulation teaching energy conservation and orbital dynamics."
            ]
        )
    ]

    card_w = 3.65
    gap = 0.39
    for i, (title, sub, color, bullets) in enumerate(pillars):
        x = 0.8 + i * (card_w + gap)
        add_card(slide, x, 1.85, card_w, 3.5)
        tb = slide.shapes.add_textbox(Inches(x + 0.2), Inches(2.05), Inches(card_w - 0.4), Inches(3.1))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0

        p_t = tf.paragraphs[0]
        p_t.text = title
        p_t.font.name = FONT_HEADING
        p_t.font.size = Pt(13)
        p_t.font.bold = True
        p_t.font.color.rgb = color
        p_t.space_after = Pt(2)

        p_s = tf.add_paragraph()
        p_s.text = sub
        p_s.font.name = FONT_MONO
        p_s.font.size = Pt(9.5)
        p_s.font.bold = True
        p_s.font.color.rgb = COLOR_SLATE_MUTED
        p_s.space_after = Pt(12)

        for b in bullets:
            p_b = tf.add_paragraph()
            p_b.text = "• " + b
            p_b.font.name = FONT_BODY
            p_b.font.size = Pt(10.5)
            p_b.font.color.rgb = COLOR_SLATE_LIGHT
            p_b.space_after = Pt(8)

    # Bottom Architectural Highlight Banner
    add_card(slide, 0.8, 5.5, 11.733, 1.15, bg_color=COLOR_CARD_INNER, border_color=COLOR_CARD_BORDER_CYAN)
    tb_bot = slide.shapes.add_textbox(Inches(1.05), Inches(5.62), Inches(11.233), Inches(0.9))
    tf_b = tb_bot.text_frame
    tf_b.word_wrap = True
    tf_b.margin_left = tf_b.margin_right = tf_b.margin_top = tf_b.margin_bottom = 0

    p_bt = tf_b.paragraphs[0]
    p_bt.text = "ENTERPRISE CLIENT-SIDE ARCHITECTURE HIGHLIGHT"
    p_bt.font.name = FONT_HEADING
    p_bt.font.size = Pt(11)
    p_bt.font.bold = True
    p_bt.font.color.rgb = COLOR_CYAN
    p_bt.space_after = Pt(4)

    p_bd = tf_b.add_paragraph()
    p_bd.text = (
        "Engineered to run 100% client-side in modern web browsers with zero installations or plugins. "
        "Leveraging WebGL shader pipelines, Draco geometry compression, and asynchronous audio decoders, "
        "Novochronos delivers instant sub-second interactive loads across desktop, tablet, and mobile browsers."
    )
    p_bd.font.name = FONT_BODY
    p_bd.font.size = Pt(10.5)
    p_bd.font.color.rgb = COLOR_SLATE_LIGHT

def build_slide_4(prs):
    """Slide 4: Technical Innovation: The Helical Flight Corridor"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide)
    add_header(
        slide,
        eyebrow="TECHNICAL ARCHITECTURE & INTERACTION DESIGN",
        title="The Helical Flight Corridor: 3D Spatial Trajectory",
        subtitle="Replacing conventional 2D flat web scrolling with a parametric vertical spiral orbital path."
    )
    add_footer(slide, 4)

    # Left Column: Trajectory Mechanics
    add_card(slide, 0.8, 1.85, 5.7, 4.85)
    tb_left = slide.shapes.add_textbox(Inches(1.05), Inches(2.05), Inches(5.2), Inches(4.45))
    tf_l = tb_left.text_frame
    tf_l.word_wrap = True
    tf_l.margin_left = tf_l.margin_right = tf_l.margin_top = tf_l.margin_bottom = 0

    p_lt = tf_l.paragraphs[0]
    p_lt.text = "PARAMETRIC HELICAL TRAJECTORY"
    p_lt.font.name = FONT_HEADING
    p_lt.font.size = Pt(13)
    p_lt.font.bold = True
    p_lt.font.color.rgb = COLOR_CYAN
    p_lt.space_after = Pt(2)

    p_ls = tf_l.add_paragraph()
    p_ls.text = "ORBITAL FLIGHT MATH & CAMERA DYNAMICS"
    p_ls.font.name = FONT_MONO
    p_ls.font.size = Pt(9.5)
    p_ls.font.bold = True
    p_ls.font.color.rgb = COLOR_SLATE_MUTED
    p_ls.space_after = Pt(12)

    points_l = [
        "Continuous 3D Spiral: Probes are positioned along a parametric helix combining vertical descent with dynamic angular displacement across a 486-degree flight path.",
        "Space Shuttle STS Central Spine: A full-scale 3D Space Shuttle launch stack (Orbiter, External Tank, SRBs) anchors the origin, providing a constant spatial frame of reference.",
        "Radial Outward Orientation: Sentinel cards face outward along normal vectors, allowing background cards on the far side of the spiral to remain visible for true atmospheric depth.",
        "Inertial Damped Momentum: Camera flight employs non-linear lerp smoothing synchronized with scroll gestures, eliminating sudden camera jerks."
    ]
    for pt in points_l:
        p_pt = tf_l.add_paragraph()
        p_pt.text = "• " + pt
        p_pt.font.name = FONT_BODY
        p_pt.font.size = Pt(10.5)
        p_pt.font.color.rgb = COLOR_SLATE_LIGHT
        p_pt.space_after = Pt(8)

    # Left Pill
    p_lp = tf_l.add_paragraph()
    p_lp.text = ">> SPECS: 486° Flight Spiral | 5.2m Orbit Radius | 0.05 Lerp Damping"
    p_lp.font.name = FONT_MONO
    p_lp.font.size = Pt(9.5)
    p_lp.font.bold = True
    p_lp.font.color.rgb = COLOR_AMBER

    # Right Column: WebGL Graphics Pipeline
    add_card(slide, 6.833, 1.85, 5.7, 4.85)
    tb_right = slide.shapes.add_textbox(Inches(7.083), Inches(2.05), Inches(5.2), Inches(4.45))
    tf_r = tb_right.text_frame
    tf_r.word_wrap = True
    tf_r.margin_left = tf_r.margin_right = tf_r.margin_top = tf_r.margin_bottom = 0

    p_rt = tf_r.paragraphs[0]
    p_rt.text = "WEBGL & GRAPHICS PIPELINE"
    p_rt.font.name = FONT_HEADING
    p_rt.font.size = Pt(13)
    p_rt.font.bold = True
    p_rt.font.color.rgb = COLOR_CYAN
    p_rt.space_after = Pt(2)

    p_rs = tf_r.add_paragraph()
    p_rs.text = "PERFORMANCE & BROWSER OPTIMIZATION"
    p_rs.font.name = FONT_MONO
    p_rs.font.size = Pt(9.5)
    p_rs.font.bold = True
    p_rs.font.color.rgb = COLOR_SLATE_MUTED
    p_rs.space_after = Pt(12)

    points_r = [
        "React Three Fiber (R3F) Integration: Declarative scene orchestration allowing seamless component unmounting, frustum culling, and GPU resource reclamation.",
        "Procedural Spectral Starfield: 2,500 particles color-mapped to authentic Harvard stellar classifications (O, B, A, F, G, K, M temperatures) with subtle twinkling shaders.",
        "Draco Geometry Compression: Squeezes high-density 3D models down by up to 78%, keeping the entire application bundle under 2.5 MB for immediate mobile loading.",
        "Adaptive Viewport Geometry: Real-time recalculation of field of view (FOV) and camera clipping planes guarantees optimal layout on smartphones and ultra-wide monitors."
    ]
    for pt in points_r:
        p_pt = tf_r.add_paragraph()
        p_pt.text = "• " + pt
        p_pt.font.name = FONT_BODY
        p_pt.font.size = Pt(10.5)
        p_pt.font.color.rgb = COLOR_SLATE_LIGHT
        p_pt.space_after = Pt(8)

    # Right Pill
    p_rp = tf_r.add_paragraph()
    p_rp.text = ">> BENCHMARK: Stable 60 FPS on Standard Mobile Devices"
    p_rp.font.name = FONT_MONO
    p_rp.font.size = Pt(9.5)
    p_rp.font.bold = True
    p_rp.font.color.rgb = COLOR_GREEN

def build_slide_5(prs):
    """Slide 5: Sentinel Dossiers: Scientific Rigor & Storytelling"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide)
    add_header(
        slide,
        eyebrow="ARCHIVAL RIGOR & EXPLORATION MISSIONS",
        title="Translating NASA Planetary Telemetry into Human Stories",
        subtitle="Detailed scientific dossiers pairing verified coordinates with emotional mission narratives."
    )
    add_footer(slide, 5)

    missions = [
        (
            "OPPORTUNITY ROVER",
            "MER-B // MERIDIANI PLANUM",
            "public/images/sentinels/opportunity-rover.jpg",
            COLOR_CYAN,
            "1.95° S, 354.47° E",
            "Planned: 90 Sols | Delivered: 5,111 Sols (15 Years)",
            "Total Distance: 45.16 km driven across Mars",
            "Scientific Legacy: Discovered hematite spherules ('blueberries') and sulfate-rich rock layers, delivering definitive proof of sustained liquid water in ancient Martian history."
        ),
        (
            "INSIGHT LANDER",
            "DISCOVERY // ELYSIUM PLANITIA",
            "public/images/sentinels/insight-lander.jpg",
            COLOR_AMBER,
            "4.50° N, 135.62° E",
            "Planned: 709 Sols | Delivered: 1,440 Sols",
            "Instrument: SEIS Ultra-Sensitive Seismometer",
            "Scientific Legacy: Recorded 1,319 marsquakes through its French CNES seismometer dome, creating the first definitive interior structural map of Mars' crust, mantle, and metallic core."
        ),
        (
            "INGENUITY HELICOPTER",
            "MARS 2020 // JEZERO CRATER",
            "public/images/sentinels/ingenuity-helicopter.jpg",
            COLOR_GREEN,
            "18.44° N, 77.45° E",
            "Planned: 5 Flights | Delivered: 72 Powered Flights",
            "Flight Record: 128.8 minutes aloft | 17.0 km traversed",
            "Scientific Legacy: Achieved the first powered, controlled flight in the 1% atmosphere of another planet; scouted pathways for the Perseverance rover and rewrote planetary exploration."
        )
    ]

    card_w = 3.65
    gap = 0.39
    for i, (name, tag, img_path, color, coords, lifespan, stat, legacy) in enumerate(missions):
        x = 0.8 + i * (card_w + gap)
        add_card(slide, x, 1.85, card_w, 4.85)

        # Embedded photo
        if os.path.exists(img_path):
            slide.shapes.add_picture(img_path, Inches(x + 0.15), Inches(1.98), width=Inches(card_w - 0.3), height=Inches(1.85))

        tb = slide.shapes.add_textbox(Inches(x + 0.15), Inches(3.92), Inches(card_w - 0.3), Inches(2.65))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0

        p_name = tf.paragraphs[0]
        p_name.text = name
        p_name.font.name = FONT_HEADING
        p_name.font.size = Pt(13)
        p_name.font.bold = True
        p_name.font.color.rgb = color
        p_name.space_after = Pt(1)

        p_tag = tf.add_paragraph()
        p_tag.text = tag
        p_tag.font.name = FONT_MONO
        p_tag.font.size = Pt(8.5)
        p_tag.font.bold = True
        p_tag.font.color.rgb = COLOR_SLATE_MUTED
        p_tag.space_after = Pt(6)

        p_co = tf.add_paragraph()
        p_co.text = "Coordinates: " + coords
        p_co.font.name = FONT_BODY
        p_co.font.size = Pt(9.5)
        p_co.font.bold = True
        p_co.font.color.rgb = COLOR_WHITE
        p_co.space_after = Pt(2)

        p_ls = tf.add_paragraph()
        p_ls.text = lifespan
        p_ls.font.name = FONT_BODY
        p_ls.font.size = Pt(9)
        p_ls.font.color.rgb = COLOR_SLATE_LIGHT
        p_ls.space_after = Pt(2)

        p_st = tf.add_paragraph()
        p_st.text = stat
        p_st.font.name = FONT_BODY
        p_st.font.size = Pt(9)
        p_st.font.color.rgb = COLOR_SLATE_LIGHT
        p_st.space_after = Pt(6)

        p_lg = tf.add_paragraph()
        p_lg.text = legacy
        p_lg.font.name = FONT_BODY
        p_lg.font.size = Pt(9)
        p_lg.font.color.rgb = COLOR_SLATE_MUTED

def build_slide_6(prs):
    """Slide 6: Educational Impact & Inclusive Discovery"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide)
    add_header(
        slide,
        eyebrow="STEM OUTREACH & UNIVERSAL ACCESSIBILITY",
        title="Democratizing Planetary Science for All Generations",
        subtitle="Inspiring future aerospace engineers and planetary explorers through inclusive, accessible design."
    )
    add_footer(slide, 6)

    pillars_edu = [
        (
            "YOUNG EXPLORERS DOSSIERS",
            "K-12 STEM EDUCATION GATEWAY",
            COLOR_CYAN,
            [
                "Simplified Language Modes: Translates complex orbital mechanics and geochemical telemetry into approachable concepts.",
                "Inspirational Takeaways: Each sentinel narrative emphasizes scientific resilience, teamwork, and creative problem solving.",
                "Visual Hardware Breakdown: Interactive callouts spotlight solar arrays, robotic arms, scientific spectrometers, and radios."
            ],
            "Designed for K-12 classrooms and informal STEM workshops."
        ),
        (
            "POWER RUN ARCADE SIMULATION",
            "GAMIFIED AEROSPACE PHYSICS",
            COLOR_AMBER,
            [
                "Direct Physics Engagement: Built-in retro arcade simulation crafted natively with HTML5 Canvas and Web Audio API.",
                "Exploration Trade-Offs: Players balance rover battery reserves, navigate blinding dust storms, and realign telemetry dishes.",
                "Active Learning: Reinforces how sunlight loss and mechanical friction impacted historical missions like Opportunity."
            ],
            "Interactive learning through experiential simulation."
        ),
        (
            "UNIVERSAL ACCESSIBILITY",
            "EQUITY & UNIVERSAL DESIGN",
            COLOR_GREEN,
            [
                "Complete Closed Captions: Synchronized text captions provided for all first-person voiceovers, supporting deaf and hard-of-hearing users.",
                "WCAG AA Compliance: High-contrast typography and focus states ensure full usability for visually impaired visitors.",
                "Bandwidth Optimization: Compact bundle footprint ensures smooth operation over low-bandwidth school networks worldwide."
            ],
            "Engineered to leave no student or educator behind."
        )
    ]

    card_w = 3.65
    gap = 0.39
    for i, (title, sub, color, points, callout) in enumerate(pillars_edu):
        x = 0.8 + i * (card_w + gap)
        add_card(slide, x, 1.85, card_w, 4.85)
        tb = slide.shapes.add_textbox(Inches(x + 0.2), Inches(2.05), Inches(card_w - 0.4), Inches(4.45))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0

        p_t = tf.paragraphs[0]
        p_t.text = title
        p_t.font.name = FONT_HEADING
        p_t.font.size = Pt(13)
        p_t.font.bold = True
        p_t.font.color.rgb = color
        p_t.space_after = Pt(2)

        p_s = tf.add_paragraph()
        p_s.text = sub
        p_s.font.name = FONT_MONO
        p_s.font.size = Pt(9.5)
        p_s.font.bold = True
        p_s.font.color.rgb = COLOR_SLATE_MUTED
        p_s.space_after = Pt(12)

        for pt in points:
            p_pt = tf.add_paragraph()
            p_pt.text = "• " + pt
            p_pt.font.name = FONT_BODY
            p_pt.font.size = Pt(10.5)
            p_pt.font.color.rgb = COLOR_SLATE_LIGHT
            p_pt.space_after = Pt(10)

        p_call = tf.add_paragraph()
        p_call.text = ">> " + callout
        p_call.font.name = FONT_HEADING
        p_call.font.size = Pt(10)
        p_call.font.bold = True
        p_call.font.color.rgb = color

def build_slide_7(prs):
    """Slide 7: Space Heritage, NASA Honors & Future Vision"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide)
    add_header(
        slide,
        eyebrow="SPACE HERITAGE, NASA HONORS & FUTURE VISION",
        title="Preserving Humanity's Footprints Beyond Earth",
        subtitle="Advocating for international recognition of off-world historic sites and open science collaboration."
    )
    add_footer(slide, 7)

    # Left Column: NASA Data Sources & Credits
    add_card(slide, 0.8, 1.85, 5.7, 3.45)
    tb_left = slide.shapes.add_textbox(Inches(1.05), Inches(2.05), Inches(5.2), Inches(3.05))
    tf_l = tb_left.text_frame
    tf_l.word_wrap = True
    tf_l.margin_left = tf_l.margin_right = tf_l.margin_top = tf_l.margin_bottom = 0

    p_lt = tf_l.paragraphs[0]
    p_lt.text = "OFFICIAL NASA DATA RESOURCES & CREDITS"
    p_lt.font.name = FONT_HEADING
    p_lt.font.size = Pt(13)
    p_lt.font.bold = True
    p_lt.font.color.rgb = COLOR_CYAN
    p_lt.space_after = Pt(2)

    p_ls = tf_l.add_paragraph()
    p_ls.text = "AUTHENTIC AGENCY TELEMETRY & 3D ASSETS"
    p_ls.font.name = FONT_MONO
    p_ls.font.size = Pt(9.5)
    p_ls.font.bold = True
    p_ls.font.color.rgb = COLOR_SLATE_MUTED
    p_ls.space_after = Pt(10)

    nasa_sources = [
        "NASA Science 3D Model Repository: Official geometries from NASA JPL, JSC, GSFC, and ARC.",
        "NASA Planetary Data System (PDS): Verified landing coordinates, mission timelines, and scientific instruments.",
        "NASA Jet Propulsion Laboratory Photojournal: High-resolution archival photography from Martian expeditions.",
        "NASA Solar System Exploration Archives: Historical flight logs, mission milestones, and transcripts."
    ]
    for s in nasa_sources:
        p_s = tf_l.add_paragraph()
        p_s.text = "• " + s
        p_s.font.name = FONT_BODY
        p_s.font.size = Pt(10)
        p_s.font.color.rgb = COLOR_SLATE_LIGHT
        p_s.space_after = Pt(6)

    # Right Column: Open Source & Roadmap
    add_card(slide, 6.833, 1.85, 5.7, 3.45)
    tb_right = slide.shapes.add_textbox(Inches(7.083), Inches(2.05), Inches(5.2), Inches(3.05))
    tf_r = tb_right.text_frame
    tf_r.word_wrap = True
    tf_r.margin_left = tf_r.margin_right = tf_r.margin_top = tf_r.margin_bottom = 0

    p_rt = tf_r.paragraphs[0]
    p_rt.text = "OPEN SOURCE COMMUNITY & FUTURE EXPANSION"
    p_rt.font.name = FONT_HEADING
    p_rt.font.size = Pt(13)
    p_rt.font.bold = True
    p_rt.font.color.rgb = COLOR_AMBER
    p_rt.space_after = Pt(2)

    p_rs = tf_r.add_paragraph()
    p_rs.text = "GLOBAL COLLABORATION & NEXT HORIZONS"
    p_rs.font.name = FONT_MONO
    p_rs.font.size = Pt(9.5)
    p_rs.font.bold = True
    p_rs.font.color.rgb = COLOR_SLATE_MUTED
    p_rs.space_after = Pt(10)

    future_points = [
        "Open Source MIT License: Fully open repository inviting contributions from educators and researchers.",
        "Public Repository: https://github.com/LordScientist/Novochronos",
        "Next Horizons Roadmap: Expanding the archive from 11 to 50+ sentinels across the outer solar system.",
        "Outer System Targets: Voyager 1 & 2, Cassini at Saturn, New Horizons at Pluto, and Galileo at Jupiter."
    ]
    for pt in future_points:
        p_pt = tf_r.add_paragraph()
        p_pt.text = "• " + pt
        p_pt.font.name = FONT_BODY
        p_pt.font.size = Pt(10)
        p_pt.font.color.rgb = COLOR_SLATE_LIGHT
        p_pt.space_after = Pt(6)

    # Bottom Full-Bleed Quote Card
    add_card(slide, 0.8, 5.5, 11.733, 1.15, bg_color=COLOR_CARD_INNER, border_color=COLOR_CYAN)
    tb_quote = slide.shapes.add_textbox(Inches(1.05), Inches(5.62), Inches(11.233), Inches(0.9))
    tf_q = tb_quote.text_frame
    tf_q.word_wrap = True
    tf_q.margin_left = tf_q.margin_right = tf_q.margin_top = tf_q.margin_bottom = 0

    p_q = tf_q.paragraphs[0]
    p_q.text = '"Every sentinel resting on the red dust and lunar regolith is an eternal monument to human courage, scientific curiosity, and our boundless desire to explore."'
    p_q.font.name = FONT_HEADING
    p_q.font.size = Pt(11)
    p_q.font.bold = True
    p_q.font.color.rgb = COLOR_WHITE
    p_q.space_after = Pt(4)

    p_qa = tf_q.add_paragraph()
    p_qa.text = "NOVOCHRONOS MISSION ARCHIVE | NASA SPACE APPS CHALLENGE 2026 GLOBAL DEMONSTRATION"
    p_qa.font.name = FONT_MONO
    p_qa.font.size = Pt(9)
    p_qa.font.bold = True
    p_qa.font.color.rgb = COLOR_CYAN

def validate_presentation(prs):
    """Enforces zero em dashes and exact slide count."""
    print("Validating presentation constraints...")
    
    # 1. Check slide count
    assert len(prs.slides) == 7, f"Error: Presentation must have exactly 7 slides, found {len(prs.slides)}"
    print("✓ Slide count verified: Exactly 7 slides")

    # 2. Check for em dashes across all slides and shapes
    em_dash_violations = []
    for s_idx, slide in enumerate(prs.slides, start=1):
        for shape in slide.shapes:
            if shape.has_text_frame:
                for p in shape.text_frame.paragraphs:
                    text = p.text
                    if "—" in text or "–" in text or " -- " in text:
                        em_dash_violations.append((s_idx, text))

    if em_dash_violations:
        print(f"FAILED: Found {len(em_dash_violations)} em dash violations:")
        for s_idx, text in em_dash_violations:
            print(f"  Slide {s_idx}: {text}")
        sys.exit(1)
    else:
        print("✓ Zero em dashes verified across all 7 slides")

def main():
    output_path = "docs/NOVOCHRONOS_7_SLIDE_PRESENTATION.pptx"
    prs = create_presentation()

    print("Building Slide 1: Title & Project Identity...")
    build_slide_1(prs)

    print("Building Slide 2: The Challenge...")
    build_slide_2(prs)

    print("Building Slide 3: The Solution...")
    build_slide_3(prs)

    print("Building Slide 4: 3D Flight Architecture...")
    build_slide_4(prs)

    print("Building Slide 5: Sentinel Dossiers...")
    build_slide_5(prs)

    print("Building Slide 6: Education & Universal Access...")
    build_slide_6(prs)

    print("Building Slide 7: Space Heritage & NASA Honors...")
    build_slide_7(prs)

    validate_presentation(prs)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    prs.save(output_path)
    file_size_kb = os.path.getsize(output_path) / 1024
    print(f"\nSUCCESS: Presentation generated successfully!")
    print(f"Output File: {output_path}")
    print(f"File Size: {file_size_kb:.1f} KB")

if __name__ == "__main__":
    main()

