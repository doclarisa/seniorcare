import Link from "next/link";
import { EbookForm } from "./EbookForm";

export const metadata = {
  title: "Free Book: How to Pay for Assisted Living in Illinois Without Going Broke",
  description:
    "A free, plain-language family guide to Medicaid spend-down, the five-year look-back, VA Aid & Attendance, spousal protections, and Illinois' Supportive Living Program.",
  alternates: { canonical: "/ebook" },
};

export default function EbookPage() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600;8..60,700&family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <style>{`
        .ebook-page{
          --navy:#16324f;
          --navy-deep:#0f2439;
          --brass:#a9772a;
          --brass-soft:#c6963c;
          --cream:#f3efe4;
          --card:#faf7ef;
          --ink:#242019;
          --ink-soft:#57524a;
          --line:#e2dbc8;
          --line-soft:#eae4d5;
          --focus:#c6963c;
          --serif:"Source Serif 4",Georgia,"Times New Roman",serif;
          --sans:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          font-family:var(--sans);
          color:var(--ink);
          background:var(--cream);
          font-size:18px;
          line-height:1.65;
          -webkit-font-smoothing:antialiased;
        }
        .ebook-page *{box-sizing:border-box}
        .ebook-page .wrap{max-width:1080px;margin:0 auto;padding:0 24px}
        .ebook-page a{color:var(--navy);text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px}
        .ebook-page a:hover{color:var(--brass)}
        .ebook-page :focus-visible{outline:3px solid var(--focus);outline-offset:2px;border-radius:2px}

        .ebook-page .masthead{border-bottom:1px solid var(--line);background:var(--cream)}
        .ebook-page .masthead .wrap{display:flex;align-items:center;justify-content:space-between;padding-top:18px;padding-bottom:18px}
        .ebook-page .brand{font-family:var(--serif);font-weight:600;font-size:20px;color:var(--navy);letter-spacing:.2px;text-decoration:none}
        .ebook-page .brand:hover{color:var(--navy)}
        .ebook-page .brand span{color:var(--brass)}
        .ebook-page .masthead .back{font-size:15px;color:var(--ink-soft);text-decoration:none}
        .ebook-page .masthead .back:hover{color:var(--navy)}

        .ebook-page .hero{padding:64px 0 56px}
        .ebook-page .hero-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:56px;align-items:start}
        .ebook-page .eyebrow{font-family:var(--sans);font-weight:600;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:var(--brass);margin-bottom:20px;display:flex;align-items:center;gap:10px}
        .ebook-page .eyebrow::before{content:"";width:28px;height:2px;background:var(--brass);display:inline-block}
        .ebook-page h1{font-family:var(--serif);font-weight:600;color:var(--navy);font-size:clamp(34px,4.4vw,52px);line-height:1.08;letter-spacing:-.01em;margin-bottom:22px}
        .ebook-page .hero-lede{font-size:19px;color:var(--ink-soft);max-width:40ch;margin-bottom:8px}
        .ebook-page .byline{margin-top:22px;font-size:15.5px;color:var(--ink-soft)}
        .ebook-page .byline b{color:var(--navy);font-weight:600}

        .ebook-page .form-card{background:var(--navy);color:#f4f1e8;border-radius:16px;padding:34px 32px 30px;box-shadow:0 18px 44px -22px rgba(15,36,57,.55);position:sticky;top:24px}
        .ebook-page .form-card h2{font-family:var(--serif);font-weight:600;font-size:25px;line-height:1.2;margin-bottom:8px;color:#fff}
        .ebook-page .form-card .sub{font-size:15.5px;color:#c2d0dd;margin-bottom:24px}
        .ebook-page .field{margin-bottom:16px}
        .ebook-page .field label{display:block;font-size:14px;font-weight:600;color:#dbe4ec;margin-bottom:6px}
        .ebook-page .field input{width:100%;padding:14px 15px;font-size:17px;font-family:var(--sans);border:1px solid #38516b;border-radius:10px;background:#1d3f60;color:#fff}
        .ebook-page .field input::placeholder{color:#88a0b6}
        .ebook-page .field input:focus{outline:3px solid var(--focus);outline-offset:1px;border-color:var(--focus)}
        .ebook-page .hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
        .ebook-page .cta{width:100%;padding:16px 20px;font-size:18px;font-weight:600;font-family:var(--sans);color:var(--navy-deep);background:var(--brass-soft);border:none;border-radius:10px;cursor:pointer;transition:background .15s ease,transform .05s ease;margin-top:4px}
        .ebook-page .cta:hover{background:#d6a850}
        .ebook-page .cta:active{transform:translateY(1px)}
        .ebook-page .cta:disabled{opacity:.7;cursor:default}
        .ebook-page .microtrust{margin-top:14px;font-size:13.5px;color:#a9bccb;line-height:1.5;text-align:center}
        .ebook-page .microtrust::before{content:"\\2713  ";color:var(--brass-soft)}

        .ebook-page .form-success{text-align:center;padding:14px 4px}
        .ebook-page .form-success .tick{width:52px;height:52px;border-radius:50%;background:var(--brass-soft);color:var(--navy-deep);display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 16px;font-weight:700}
        .ebook-page .form-success h2{margin-bottom:10px}
        .ebook-page .form-success p{font-size:15.5px;color:#c2d0dd;line-height:1.6}

        .ebook-page .trust{background:var(--navy-deep);color:#e7ecf1}
        .ebook-page .trust .wrap{display:flex;flex-wrap:wrap;gap:14px 36px;justify-content:center;padding:20px 24px}
        .ebook-page .trust-item{font-size:14.5px;color:#cdd8e2;display:flex;align-items:center;gap:9px}
        .ebook-page .trust-item b{color:#fff;font-weight:600}
        .ebook-page .trust-dot{width:7px;height:7px;border-radius:50%;background:var(--brass-soft);flex:none}

        .ebook-page section.band{padding:66px 0}
        .ebook-page .band-title{font-family:var(--serif);font-weight:600;color:var(--navy);font-size:clamp(26px,3vw,34px);line-height:1.15;margin-bottom:14px}
        .ebook-page .band-intro{font-size:18px;color:var(--ink-soft);max-width:60ch;margin-bottom:40px}

        .ebook-page .parts{display:grid;grid-template-columns:repeat(2,1fr);gap:26px 40px}
        .ebook-page .part-item{padding-left:20px;border-left:2px solid var(--brass-soft)}
        .ebook-page .part-item .num{font-family:var(--serif);font-weight:600;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--brass);margin-bottom:4px}
        .ebook-page .part-item h3{font-family:var(--serif);font-weight:600;font-size:20px;color:var(--navy);margin-bottom:6px;line-height:1.25}
        .ebook-page .part-item p{font-size:16px;color:var(--ink-soft);line-height:1.55}

        .ebook-page .who{background:var(--card);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
        .ebook-page .who .wrap{max-width:760px;text-align:center}
        .ebook-page .who blockquote{font-family:var(--serif);font-size:clamp(21px,2.6vw,27px);line-height:1.4;color:var(--navy);font-weight:400}
        .ebook-page .who .attrib{margin-top:20px;font-size:15px;color:var(--ink-soft)}

        .ebook-page .next{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:8px}
        .ebook-page .next-card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:30px 28px}
        .ebook-page .next-card h3{font-family:var(--serif);font-weight:600;font-size:22px;color:var(--navy);margin-bottom:8px}
        .ebook-page .next-card p{font-size:16px;color:var(--ink-soft);margin-bottom:20px;line-height:1.55}
        .ebook-page .btn-outline{display:inline-block;padding:12px 22px;font-size:16px;font-weight:600;color:var(--navy);border:1.5px solid var(--navy);border-radius:9px;text-decoration:none;transition:background .15s,color .15s}
        .ebook-page .btn-outline:hover{background:var(--navy);color:#fff}
        .ebook-page .btn-solid{display:inline-block;padding:12px 22px;font-size:16px;font-weight:600;color:#fff;background:var(--navy);border:1.5px solid var(--navy);border-radius:9px;text-decoration:none;transition:background .15s}
        .ebook-page .btn-solid:hover{background:var(--navy-deep);color:#fff}

        .ebook-page footer.site-footer{background:var(--navy-deep);color:#aebccb;padding:44px 0 40px;font-size:14.5px;line-height:1.6}
        .ebook-page footer.site-footer .wrap{display:grid;gap:22px}
        .ebook-page footer.site-footer .foot-brand{font-family:var(--serif);font-size:19px;color:#fff;font-weight:600}
        .ebook-page footer.site-footer .foot-brand span{color:var(--brass-soft)}
        .ebook-page footer.site-footer a{color:#d4dee7}
        .ebook-page footer.site-footer a:hover{color:#fff}
        .ebook-page .disclaimer{font-size:13px;color:#8fa1b2;border-top:1px solid #26405a;padding-top:20px;max-width:80ch}

        @media (max-width:860px){
          .ebook-page .hero-grid{grid-template-columns:1fr;gap:40px}
          .ebook-page .form-card{position:static}
          .ebook-page .parts{grid-template-columns:1fr;gap:22px}
          .ebook-page .next{grid-template-columns:1fr}
          .ebook-page .hero{padding:44px 0 40px}
          .ebook-page{font-size:17px}
        }
        @media (prefers-reduced-motion:reduce){
          .ebook-page *{transition:none!important}
        }
      `}</style>

      <div className="ebook-page">
        <header className="masthead">
          <div className="wrap">
            <Link className="brand" href="/">
              Chicago Care<span>&middot;</span>for Seniors
            </Link>
            <Link className="back" href="/">
              Browse the directory &rarr;
            </Link>
          </div>
        </header>

        <main>
          <section className="hero">
            <div className="wrap hero-grid">
              <div className="hero-copy">
                <div className="eyebrow">Free family guide</div>
                <h1>How to Pay for Assisted Living in Illinois Without Going Broke</h1>
                <p className="hero-lede">
                  A plain-language guide to Medicaid spend-down, the five-year look-back, VA Aid
                  &amp; Attendance, spousal protections, and Illinois&rsquo; Supportive Living
                  Program &mdash; built around the real decisions families have to make, usually
                  on a deadline.
                </p>
                <p className="byline">
                  By <b>Larisa Huhman</b>, founder of Chicago Care for Seniors &mdash; written for
                  the son or daughter making these decisions for a parent.
                </p>
              </div>

              <aside>
                <EbookForm />
              </aside>
            </div>
          </section>

          <div className="trust">
            <div className="wrap">
              <div className="trust-item">
                <span className="trust-dot"></span>
                <b>Illinois-specific</b>&nbsp;rules, not generic advice
              </div>
              <div className="trust-item">
                <span className="trust-dot"></span>
                <b>190+ pages</b>&nbsp;of worked examples and worksheets
              </div>
              <div className="trust-item">
                <span className="trust-dot"></span>
                <b>Always free</b>&nbsp;for families
              </div>
              <div className="trust-item">
                <span className="trust-dot"></span>
                <b>No sign-up fee</b>&nbsp;&mdash; just your email
              </div>
            </div>
          </div>

          <section className="band">
            <div className="wrap">
              <h2 className="band-title">What&rsquo;s inside</h2>
              <p className="band-intro">
                Seven parts, written in the order families actually make these decisions: define
                the problem, build a payment bridge, understand public programs, and turn it into
                a plan.
              </p>

              <div className="parts">
                <div className="part-item">
                  <div className="num">Part I</div>
                  <h3>Understand the problem before spending money</h3>
                  <p>Care settings, real prices, and the one-page family financial snapshot.</p>
                </div>
                <div className="part-item">
                  <div className="num">Part II</div>
                  <h3>Build the private-pay bridge</h3>
                  <p>
                    Financial runway, income sources families overlook, the house, insurance, and
                    cost control.
                  </p>
                </div>
                <div className="part-item">
                  <div className="num">Part III</div>
                  <h3>Illinois Medicaid without myths</h3>
                  <p>
                    Countable vs. exempt assets, lawful spend-down, the five-year look-back, and
                    estate recovery.
                  </p>
                </div>
                <div className="part-item">
                  <div className="num">Part IV</div>
                  <h3>Protecting the spouse at home</h3>
                  <p>Spousal impoverishment rules, explained with real Illinois couple case studies.</p>
                </div>
                <div className="part-item">
                  <div className="num">Part V</div>
                  <h3>VA Pension with Aid &amp; Attendance</h3>
                  <p>Eligibility, safe applications, and how it coordinates with Medicaid.</p>
                </div>
                <div className="part-item">
                  <div className="num">Part VI &amp; VII</div>
                  <h3>Supportive Living &amp; the family plan</h3>
                  <p>
                    How Illinois&rsquo; SLP works, plus a 30-day and one-to-five-year action plan
                    to turn all of it into decisions.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="who">
            <div className="wrap band" style={{ paddingTop: 56, paddingBottom: 56 }}>
              <blockquote>
                &ldquo;Monday was still coming. But now she knew the next question to ask.&rdquo;
              </blockquote>
              <p className="attrib">
                From the opening chapter &mdash; a family given a Monday discharge date and no
                real plan for what comes next.
              </p>
            </div>
          </section>

          <section className="band">
            <div className="wrap">
              <h2 className="band-title">When you&rsquo;re ready for the next step</h2>
              <p className="band-intro">
                The book is yours to keep. When it helps to talk it through, we&rsquo;re here
                &mdash; at no cost to your family.
              </p>
              <div className="next">
                <div className="next-card">
                  <h3>Compare communities</h3>
                  <p>
                    Search assisted living, memory care, and Supportive Living across Cook,
                    DuPage, and the collar counties &mdash; with inspection history, not just
                    glossy listings.
                  </p>
                  <Link className="btn-outline" href="/search">
                    Browse the free directory
                  </Link>
                </div>
                <div className="next-card">
                  <h3>Talk to a real person</h3>
                  <p>
                    A free care call to help you narrow the options, understand costs, and
                    organize the paperwork. We&rsquo;re paid by the community when a family moves
                    in &mdash; never by you.
                  </p>
                  <Link className="btn-solid" href="/contact">
                    Book a free care call
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="site-footer">
          <div className="wrap">
            <div className="foot-brand">
              Chicago Care <span>&middot;</span> for Seniors
            </div>
            <div>
              <Link href="/">Home</Link> &nbsp;&middot;&nbsp; <Link href="/search">Find care</Link>{" "}
              &nbsp;&middot;&nbsp; <Link href="/guides">Guides</Link> &nbsp;&middot;&nbsp;{" "}
              <Link href="/about">About</Link> &nbsp;&middot;&nbsp;{" "}
              <a href="mailto:info@chicagocareforseniors.com">info@chicagocareforseniors.com</a>
            </div>
            <p className="disclaimer">
              This book and website provide general educational information only. They are not
              legal, financial, tax, benefits, or medical advice, and no professional relationship
              is created by downloading the book or contacting us. Program rules, benefit amounts,
              and figures can change &mdash; confirm current details with the responsible
              government agency and a qualified professional before acting. &copy;{" "}
              {new Date().getFullYear()} Chicago Care for Seniors.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
