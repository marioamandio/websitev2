import React, { useState, useEffect, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import styled from "styled-components";
import { srConfig } from "../../config";
import { KEY_CODES } from "../../utils";
import sr from "../../utils/sr";
import { usePrefersReducedMotion } from "../../hooks";

const StyledJobsSection = styled.section`
  max-width: 900px;

  .inner {
    display: flex;

    @media (max-width: 600px) {
      display: block;
    }

    // Prevent container from jumping
    @media (min-width: 700px) {
      min-height: 340px;
    }
  }
`;

const StyledTabList = styled.div`
  position: relative;
  z-index: 3;
  width: max-content;
  padding: 0;
  margin: 0;
  list-style: none;

  @media (max-width: 600px) {
    display: flex;
    overflow-x: auto;
    width: calc(100% + 100px);
    padding-left: 50px;
    margin-left: -50px;
    margin-bottom: 30px;
  }
  @media (max-width: 480px) {
    width: calc(100% + 50px);
    padding-left: 25px;
    margin-left: -25px;
  }

  li {
    &:first-of-type {
      @media (max-width: 600px) {
        margin-left: 50px;
      }
      @media (max-width: 480px) {
        margin-left: 25px;
      }
    }
    &:last-of-type {
      @media (max-width: 600px) {
        padding-right: 50px;
      }
      @media (max-width: 480px) {
        padding-right: 25px;
      }
    }
  }
`;

const StyledTabButton = styled.button<{
  isActive: boolean;
}>`
  ${({ theme }) => theme.mixins.link};
  display: flex;
  align-items: center;
  width: 100%;
  height: var(--tab-height);
  padding: 0 20px 2px;
  border-left: 2px solid var(--lightest-navy);
  background-color: transparent;
  color: ${({ isActive }) => (isActive ? "var(--green)" : "var(--slate)")};
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  text-align: left;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 0 15px 2px;
  }
  @media (max-width: 600px) {
    ${({ theme }) => theme.mixins.flexCenter};
    min-width: 120px;
    padding: 0 15px;
    border-left: 0;
    border-bottom: 2px solid var(--lightest-navy);
    text-align: center;
  }

  &:hover,
  &:focus {
    background-color: var(--light-navy);
  }
`;

const StyledHighlight = styled.div<{ activeTabId: number }>`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 2px;
  height: var(--tab-height);
  border-radius: var(--border-radius);
  background: var(--green);
  transform: translateY(
    calc(${({ activeTabId }) => activeTabId} * var(--tab-height))
  );
  transition: transform 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition-delay: 0.1s;

  @media (max-width: 600px) {
    top: auto;
    bottom: 0;
    width: 100%;
    max-width: var(--tab-width);
    height: 2px;
    margin-left: 50px;
    transform: translateX(
      calc(${({ activeTabId }) => activeTabId} * var(--tab-width))
    );
  }
  @media (max-width: 480px) {
    margin-left: 25px;
  }
`;

const StyledTabPanels = styled.div`
  position: relative;
  width: 100%;
  margin-left: 20px;

  @media (max-width: 600px) {
    margin-left: 0;
  }
`;

const StyledTabPanel = styled.div`
  width: 100%;
  height: auto;
  padding: 10px 5px;

  ul {
    ${({ theme }) => theme.mixins.fancyList};
  }

  h3 {
    margin-bottom: 2px;
    font-size: var(--fz-xxl);
    font-weight: 500;
    line-height: 1.3;

    .company {
      color: var(--green);
    }
  }

  .range {
    margin-bottom: 25px;
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }
`;

const Jobs = () => {
  const jobsData = [
    {
      title: "senior Front end developer",
      company: "AthenX",
      location: "London",
      range: "July 2024 - September 2024",
      url: "https://athenx.com",
      description: [
        "Led the design, development, and implementation of a real-time dashboard platform incorporating advanced data visualisations and geo-mapping functionalities.",
        "Applied a range of generative AI tools, including Cursor, UIzard to streamline workflows and boost team productivity by over 80%, significantly enhancing efficiency in daily tasks.",
        "Upgraded data visibility for stakeholders, saving 20+ hours weekly in manual data analysis.",
        "Actively participated in back-end design and implementation to deliver seamless, full-stack solutions.",
        "Collaborated closely with stakeholders to gather requirements and provide regular project status updates, resulting in an significant improvement in project delivery efficiency.",
        "Operated in a dynamic, fast-paced environment, played a part in the company's early-stage startup phase as the fourth employee, helping scale the product to support a 100% client growth.",
      ],
    },
    {
      title: "senior Front end developer",
      company: "Luna Protocol LTD",
      location: "London",
      range: "February 2023 - June 2024",
      url: "https://www.luna-protocol.com",
      description: [
        "Engaged in the development and maintenance of a smart contracts platform, focused on institutional financial instruments.",
        "Engineered an application dashboard to visualize the Luna core engine, which played a key role in external demonstrations and was instrumental in securing our first client.",
        "Thrived in a fast-paced environment, refining a strong understanding of business prioritization and alignment with organizational goals.",
        "Played a key role in the technical migration from Create React App to Next.js14, enhancing the platform's performance and scalability, which was critical in achieving ISO27001 certification.",
        "Teamed up within a multidisciplinary team to drive key aspects of product development and analysis, enabling informed decision-making and refining features for optimal results.",
        "Led the implementation of end-to-end, integration, and unit testing strategies using Cypress and React Testing Library to ensure platform stability and quality.",
        "Spearheaded the migration from Vanilla JavaScript to TypeScript across the codebase, improving code reliability and maintainability.",
      ],
    },
    {
      title: "senior Frontend developer",
      company: "Yobota, Chetwood Financial",
      location: "London",
      range: "January 2022 - February 2023",
      url: "https://chetwood.co/?source=yobota",
      description: [
        "Redesigned and maintained a front-end application tailored for banking institution staff, utilizing React, TypeScript, Nivo Charts, and Styled Components to enhance usability and performance.",
        "Participated in the development of CI/CD infrastructure and workflows to streamline deployment and integration processes.",
        "Implemented comprehensive testing strategies across various application features, increasing system reliability by over 10% and reducing post-release bugs by over 50%.",
      ],
    },
    {
      title: "JavaScript developer",
      company: "CMC Markets",
      location: "London",
      range: "August 2019 - January 2022",
      url: "https://www.cmcmarkets.com",
      description: [
        "Crafted a modernized version of onboarding forms for a trading platform, enhancing user experience and functionality, resulting in a 20% reduction in the onboarding signup process time.",
        "Engineered the forms using cutting-edge technologies to improve efficiency and maintainability.",
        "Promoted and optimized the use of a design library, driving consistent UX improvements across multiple applications and use cases.",
        "During a digital transformation initiative, I was part of a pivotal team assigned to lead a flagship project, setting a standard for best practices and serving as a role model for the entire organization’s transition process.",
      ],
    },
    {
      title: "Frontend developer",
      company: "Simudyne",
      location: "London",
      range: "January 2019 - July 2019",
      url: "https://www.simudyne.com",
      description: [
        "Enhanced data visualizations for agent-based models, improving clarity and insights for end users.",
        "Redesigned and maintained a dashboard featuring multiple visualizations, ensuring a more intuitive and user-friendly interface.",
        "Contributed to the development of a supporting documentation website to provide comprehensive resources and guidance for users.",
      ],
    },
  ];

  const [activeTabId, setActiveTabId] = useState(0);
  const [tabFocus, setTabFocus] = useState(null);
  const tabs = useRef([]);
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    if (sr) {
      // eslint-disable-next-line
      // @ts-ignore
      sr.reveal(revealContainer.current, srConfig());
    }
  }, []);

  const focusTab = () => {
    // eslint-disable-next-line
    // @ts-ignore
    if (tabs.current[tabFocus]) {
      // eslint-disable-next-line
      // @ts-ignore
      tabs.current[tabFocus].focus();
      return;
    }
    // If we're at the end, go to the start
    // eslint-disable-next-line
    // @ts-ignore
    if (tabFocus >= tabs.current.length) {
      // eslint-disable-next-line
      // @ts-ignore
      setTabFocus(0);
    }
    // If we're at the start, move to the end
    // eslint-disable-next-line
    // @ts-ignore
    if (tabFocus < 0) {
      // eslint-disable-next-line
      // @ts-ignore
      setTabFocus(tabs.current.length - 1);
    }
  };

  // Only re-run the effect if tabFocus changes
  useEffect(() => focusTab(), [tabFocus]);

  // Focus on tabs when using up & down arrow keys
  // eslint-disable-next-line
  // @ts-ignore
  const onKeyDown = (e) => {
    switch (e.key) {
      case KEY_CODES.ARROW_UP: {
        e.preventDefault();
        // eslint-disable-next-line
        // @ts-ignore
        setTabFocus(tabFocus - 1);
        break;
      }

      case KEY_CODES.ARROW_DOWN: {
        e.preventDefault();
        // eslint-disable-next-line
        // @ts-ignore
        setTabFocus(tabFocus + 1);
        break;
      }

      default: {
        break;
      }
    }
  };

  return (
    <StyledJobsSection id="jobs" ref={revealContainer}>
      <h2 className="numbered-heading">My Career Path</h2>

      <div className="inner">
        <StyledTabList
          role="tablist"
          aria-label="Job tabs"
          onKeyDown={(e) => onKeyDown(e)}
        >
          {jobsData &&
            jobsData.map(({ company }, i) => {
              return (
                <StyledTabButton
                  key={i}
                  isActive={activeTabId === i}
                  onClick={() => setActiveTabId(i)}
                  // eslint-disable-next-line
                  // @ts-ignore
                  ref={(el) => (tabs.current[i] = el)}
                  id={`tab-${i}`}
                  role="tab"
                  tabIndex={activeTabId === i ? 0 : -1}
                  aria-selected={activeTabId === i ? true : false}
                  aria-controls={`panel-${i}`}
                >
                  <span>{company}</span>
                </StyledTabButton>
              );
            })}
          <StyledHighlight activeTabId={activeTabId} />
        </StyledTabList>

        <StyledTabPanels>
          {jobsData &&
            jobsData.map(({ title, url, company, range, description }, i) => {
              return (
                <CSSTransition
                  key={i}
                  in={activeTabId === i}
                  timeout={250}
                  classNames="fade"
                >
                  <StyledTabPanel
                    id={`panel-${i}`}
                    role="tabpanel"
                    tabIndex={activeTabId === i ? 0 : -1}
                    aria-labelledby={`tab-${i}`}
                    aria-hidden={activeTabId !== i}
                    hidden={activeTabId !== i}
                  >
                    <h3>
                      <span>{title}</span>
                      <span className="company">
                        &nbsp;@&nbsp;
                        <a href={url} target="_blank" className="inline-link">
                          {company}
                        </a>
                      </span>
                    </h3>

                    <p className="range">{range}</p>

                    <div>
                      {description.map((task, idx) => {
                        return <p key={i + idx}>{task}</p>;
                      })}
                    </div>
                  </StyledTabPanel>
                </CSSTransition>
              );
            })}
        </StyledTabPanels>
      </div>
    </StyledJobsSection>
  );
};

export default Jobs;
