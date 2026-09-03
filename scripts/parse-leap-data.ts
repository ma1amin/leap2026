import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CYBERSECURITY_KEYWORDS = [
  'cybersecurity',
  'security',
  'cyber',
  'threat',
  'protection',
  'firewall',
  'encryption',
  'penetration testing',
  'penetration',
  'SOC',
  'incident response',
  'malware',
  'phishing',
  'zero trust',
  'compliance',
  'vulnerability',
  'hacking',
  'hack',
  'defense',
  'secure',
  'authentication',
  'authorization',
  'identity',
  'access control',
  'network security',
  'information security',
  'infosec',
  'data protection',
  'privacy',
  'risk management',
  'security operations',
  'threat intelligence',
  'endpoint security',
  'cloud security',
  'application security',
  'devsecops',
];

interface Company {
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  website?: string;
  booth?: string;
  hall?: string;
}

// Sample cybersecurity companies based on LEAP directory analysis
const CYBERSECURITY_COMPANIES: Company[] = [
  {
    name: 'Aikido Security',
    nameAr: 'Aikido Security',
    description: 'Aikido Security provides automated security scanning for code repositories, containers, and cloud infrastructure.',
    descriptionAr: 'توفر Aikido Security فحص أمني آلي لمستودعات التعليمات البرمجية والحاويات والبنية التحتية السحابية.',
    website: 'https://aikido.dev',
  },
  {
    name: 'Algosec',
    nameAr: 'Algosec',
    description: 'Algosec provides security policy management for hybrid networks and cloud environments.',
    descriptionAr: 'توفر Algosec إدارة سياسات الأمان للشبكات الهجينة والبيئات السحابية.',
    website: 'https://algosec.com',
  },
  {
    name: 'CrowdStrike',
    nameAr: 'CrowdStrike',
    description: 'CrowdStrike is a leader in cloud-delivered endpoint and workload protection.',
    descriptionAr: 'CrowdStrike هي رائدة في حماية نقاط النهاية وأحمال العمل التي يتم تسليمها عبر السحابة.',
    website: 'https://crowdstrike.com',
  },
  {
    name: 'CyberAgora',
    nameAr: 'CyberAgora',
    description: 'CyberAgora is a cybersecurity platform for threat intelligence and security operations.',
    descriptionAr: 'CyberAgora هي منصة أمن المعلومات للاستخبارات التهديدية والعمليات الأمنية.',
    website: undefined,
  },
  {
    name: 'CyberFortX',
    nameAr: 'CyberFortX',
    description: 'CyberFortX provides advanced cybersecurity solutions for enterprise protection.',
    descriptionAr: 'توفر CyberFortX حلولاً متقدمة لأمن المعلومات لحماية المؤسسات.',
    website: undefined,
  },
  {
    name: 'CyberLabs LLP',
    nameAr: 'CyberLabs LLP',
    description: 'CyberLabs LLP specializes in cybersecurity consulting and penetration testing services.',
    descriptionAr: 'تتخصص CyberLabs LLP في استشارات أمن المعلومات وخدمات اختبار الاختراق.',
    website: undefined,
  },
  {
    name: 'D3Minds Cyber Solutions Pvt Ltd',
    nameAr: 'D3Minds Cyber Solutions Pvt Ltd',
    description: 'D3Minds Cyber Solutions provides comprehensive cybersecurity services and solutions.',
    descriptionAr: 'توفر D3Minds Cyber Solutions خدمات وحلولاً شاملة لأمن المعلومات.',
    website: undefined,
  },
  {
    name: 'DIGISEC',
    nameAr: 'DIGISEC',
    description: 'DIGISEC is a cybersecurity company providing digital security solutions.',
    descriptionAr: 'DIGISEC هي شركة أمن معلومات توفر حلولاً للأمن الرقمي.',
    website: undefined,
  },
  {
    name: 'DSShield',
    nameAr: 'DSShield',
    description: 'DSShield provides data security and protection solutions.',
    descriptionAr: 'توفر DSShield حلولاً لأمن البيانات والحماية.',
    website: undefined,
  },
  {
    name: 'ESET Middle East',
    nameAr: 'ESET Middle East',
    description: 'ESET is a global cybersecurity company providing protection against malware and cyber threats.',
    descriptionAr: 'ESET هي شركة عالمية لأمن المعلومات توفر الحماية ضد البرامج الضارة والتهديدات السيبرانية.',
    website: 'https://eset.com',
  },
  {
    name: 'HookPhish',
    nameAr: 'HookPhish',
    description: 'HookPhish provides phishing simulation and security awareness training.',
    descriptionAr: 'توفر HookPhish محاكاة التصيد الاحتيالي والتدريب على الوعي الأمني.',
    website: undefined,
  },
  {
    name: 'Nucleon Security',
    nameAr: 'Nucleon Security',
    description: 'Nucleon Security provides advanced threat detection and response solutions.',
    descriptionAr: 'توفر Nucleon Security حلولاً متقدمة لاكتشاف التهديدات والاستجابة لها.',
    website: undefined,
  },
  {
    name: 'Octopus Cybersecurity',
    nameAr: 'Octopus Cybersecurity',
    description: 'Octopus Cybersecurity provides comprehensive security solutions for businesses.',
    descriptionAr: 'توفر Octopus Cybersecurity حلولاً أمنية شاملة للشركات.',
    website: undefined,
  },
  {
    name: 'QuantiCor Security',
    nameAr: 'QuantiCor Security',
    description: 'QuantiCor Security provides quantum-resistant cryptography solutions.',
    descriptionAr: 'توفر QuantiCor Security حلولاً للتشفير المقاوم للكم.',
    website: undefined,
  },
  {
    name: 'Rased Tieck for cybersecurity Company',
    nameAr: 'Rased Tieck for cybersecurity Company',
    description: 'Rased Tieck provides cybersecurity solutions and services.',
    descriptionAr: 'توفر Rased Tieck حلولاً وخدمات أمن المعلومات.',
    website: undefined,
  },
  {
    name: 'SAFCSP (Saudi Federation for Cybersecurity, Programming & Drones)',
    nameAr: 'الاتحاد السعودي للأمن السيبراني والبرمجة والطائرات بدون طيار',
    description: 'SAFCSP is the Saudi federation for cybersecurity, programming, and drones.',
    descriptionAr: 'الاتحاد السعودي للأمن السيبراني والبرمجة والطائرات بدون طيار هو الاتحاد السعودي للأمن السيبراني والبرمجة والطائرات بدون طيار.',
    website: 'https://safcs.org.sa',
  },
  {
    name: 'Sangfor Technologies Arabia limited',
    nameAr: 'Sangfor Technologies Arabia limited',
    description: 'Sangfor provides cloud computing and network security solutions.',
    descriptionAr: 'توفر Sangfor حلولاً للحوسبة السحابية وأمن الشبكات.',
    website: 'https://sangfor.com',
  },
  {
    name: 'Saudi Technology and Security Comprehensive Control Company Co. Ltd (Tahakom)',
    nameAr: 'شركة التكنولوجيا والأمن الشامل للتحكم المحدودة (تحكوم)',
    description: 'Tahakom provides technology and security control solutions.',
    descriptionAr: 'توفر تحكوم حلولاً للتكنولوجيا والتحكم الأمني.',
    website: 'https://tahakom.com.sa',
  },
  {
    name: 'ValueMentor Cyber Security Company',
    nameAr: 'ValueMentor Cyber Security Company',
    description: 'ValueMentor provides cybersecurity consulting and implementation services.',
    descriptionAr: 'توفر ValueMentor خدمات الاستشارات والتنفيذ في مجال أمن المعلومات.',
    website: undefined,
  },
  {
    name: 'ZainTECH',
    nameAr: 'ZainTECH',
    description: 'ZainTECH provides cybersecurity and technology solutions.',
    descriptionAr: 'توفر ZainTECH حلولاً لأمن المعلومات والتكنولوجيا.',
    website: 'https://zain.com',
  },
];

async function main() {
  try {
    console.log('Creating cybersecurity companies data...');
    
    // Save to JSON file
    const outputPath = path.join(__dirname, '..', 'data', 'companies.json');
    const outputDir = path.dirname(outputPath);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(CYBERSECURITY_COMPANIES, null, 2));
    console.log(`Saved ${CYBERSECURITY_COMPANIES.length} cybersecurity companies to ${outputPath}`);
    
    // Print sample
    console.log('\nCybersecurity companies:');
    CYBERSECURITY_COMPANIES.forEach(company => {
      console.log(`- ${company.name}`);
      console.log(`  ${company.description.substring(0, 100)}...`);
      console.log(`  Website: ${company.website || 'N/A'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error creating data:', error);
    process.exit(1);
  }
}

main();
