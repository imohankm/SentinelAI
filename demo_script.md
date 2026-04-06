# 🚀 SENTINELAI: FINAL HACKATHON PRESENTATION GUIDE

> [!TIP]
> This document provides the exact flow, talk-track, and Q&A answers you need to guarantee a flawless and impressive presentation.

---

## 🎬 Part 1: The Live Demo Flow (What to click & what to say)

**[Start on "Lab Setup" Tab]**
**You:** “Most cybersecurity tools today only alert you to a problem. But in modern DevSecOps, we shouldn't just be detecting; we should be simulating the attack and applying fixes autonomously. Today, we are presenting SentinelAI: a self-testing, agentic cybersecurity system.”
*Action:* Click **"Initialize Lab & Connect"**.

**[Transition to "Scan" Tab]**
**You:** “Behind the scenes, we’ve spun up a genuine, isolated company server. Right now, SentinelAI is actively probing this server. As you can see, it has discovered three critical vulnerabilities in its state: missing MFA, an SQL injection vulnerability, and open network ports.”
*Action:* Wait for vulnerabilities to load. Click **"Launch Attack Simulation"**.

**[Transition to "Attack" Tab]**
**You:** (Let the logs run as you speak) 
“Now, here is where our Agentic AI comes in. Rather than just handing you a list of problems, SentinelAI launches an autonomous attacker agent. Watch the logs—it explicitly `THINKS` about the best path, `DECIDES` on an exploit, `ACTS` by pushing an actual HTTP request against the demo server, and evaluates the `RESULT`. As you can see, the attack was a massive 85% success, resulting in a system breach.”
*Action:* Wait for "Proceed to Fix Engine" button. Click it.

**[Transition to "Fix Engine" Tab]**
**You:** “This is the Fix Engine—our core differentiator. Instead of relying on a human to manually patch and hope it works, SentinelAI can dynamically deploy configuration fixes to the target server in real-time.”
*Action:* Slowly toggle on "Patch SQL Vuls", then "Close External Ports", then "Enable MFA". Let the dials load.
**You:** “As I toggle these fixes, SentinelAI is actually hot-swapping the configuration of our demo server and *instantly* re-running the Agentic Attack over the network. Look at the Before vs After comparison. We’ve mathematically proven that our fixes reduced the Attack Success rate from 85% down to just 20%, effectively halting the breach.”

---

## 🛡️ Part 2: Judge Q&A (Prepare for these questions!)

**Q1: "Is this actually doing anything, or is it just statically changing the UI numbers?"**
**A1:** "It's genuinely doing it! Our backend relies on a real, secondary target server running a local SQLite database that we spun up for this sandbox. When the Agent tries an SQL injection or a port scan, it is sending real HTTP requests to that target server. When we apply a fix, SentinelAI pushes an administrative payload to physically alter the demo server's configuration."

**Q2: "Does it fix real company production servers automatically?"**
**A2:** (Do not say yes!) "For safety and compliance, currently, it applies fixes strictly in a controlled staging or lab environment. The idea is that an organization can clone their production state into a Sandbox, SentinelAI can pen-test and patch it automatically, and once a successful fix configuration is mathematically proven here, it can generate the DevOps ticket or deploy the patch via Terraform to production."

**Q3: "Why is the Attacker Agent considered 'AI' or 'Agentic'?"**
**A3:** "Because it utilizes a dynamic 'Think -> Decide -> Act -> Result' loop. Rather than just running a static script like Nmap, our architecture evaluates the target's state dynamically. If the network port exploit is blocked, the agent adapts its strategy on the fly and pivots to an application-layer attack like SQL Injection."

**Q4: "Why did you build this?"**
**A4:** "Because Security Operations Centers (SOCs) are overwhelmed with alerts. Analysts don't have time to manually verify if every single CVE can actually be exploited in their specific environment. SentinelAI does the pen-testing and fix-validation for them."

Good luck! You're going to crush it!
