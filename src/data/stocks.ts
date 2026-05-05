import { GENERATED_STOCKS } from "./generatedStocks";

export type Stock = {
  symbol: string;
  nameKo: string;
  nameEn: string;
  market: "US" | "KS" | "KQ";
  tags: string[];
};

const CURATED_STOCKS: Stock[] = [
  // ── 미국 주식 ──────────────────────────────────────────────────
  { symbol: "AAPL",  nameKo: "애플",          nameEn: "Apple",                    market: "US", tags: ["아이폰", "맥북", "iphone", "macbook", "앱스토어"] },
  { symbol: "MSFT",  nameKo: "마이크로소프트", nameEn: "Microsoft",                market: "US", tags: ["MS", "윈도우", "windows", "azure", "오피스", "office"] },
  { symbol: "NVDA",  nameKo: "엔비디아",       nameEn: "NVIDIA",                   market: "US", tags: ["엔비", "그래픽카드", "GPU", "AI칩", "젠슨황"] },
  { symbol: "AMZN",  nameKo: "아마존",         nameEn: "Amazon",                   market: "US", tags: ["aws", "클라우드", "이커머스"] },
  { symbol: "GOOGL", nameKo: "알파벳 A",       nameEn: "Alphabet Class A",         market: "US", tags: ["구글", "google", "유튜브", "youtube", "안드로이드"] },
  { symbol: "GOOG",  nameKo: "알파벳 C",       nameEn: "Alphabet Class C",         market: "US", tags: ["구글", "google", "유튜브"] },
  { symbol: "META",  nameKo: "메타",           nameEn: "Meta Platforms",           market: "US", tags: ["페이스북", "facebook", "인스타", "instagram", "왓츠앱", "whatsapp"] },
  { symbol: "TSLA",  nameKo: "테슬라",         nameEn: "Tesla",                    market: "US", tags: ["전기차", "일론머스크", "elon", "musk", "EV", "ev"] },
  { symbol: "AVGO",  nameKo: "브로드컴",       nameEn: "Broadcom",                 market: "US", tags: ["반도체", "AI칩"] },
  { symbol: "JPM",   nameKo: "JP모건",         nameEn: "JPMorgan Chase",           market: "US", tags: ["제이피모건", "은행", "투자은행"] },
  { symbol: "V",     nameKo: "비자",           nameEn: "Visa",                     market: "US", tags: ["비자카드", "카드결제", "핀테크"] },
  { symbol: "MA",    nameKo: "마스터카드",      nameEn: "Mastercard",               market: "US", tags: ["마스터", "카드결제", "핀테크"] },
  { symbol: "WMT",   nameKo: "월마트",         nameEn: "Walmart",                  market: "US", tags: ["유통", "슈퍼마켓"] },
  { symbol: "UNH",   nameKo: "유나이티드헬스", nameEn: "UnitedHealth",             market: "US", tags: ["보험", "헬스케어", "의료보험"] },
  { symbol: "LLY",   nameKo: "일라이릴리",     nameEn: "Eli Lilly",                market: "US", tags: ["비만약", "오젬픽", "ozempic", "mounjaro", "마운자로", "릴리"] },
  { symbol: "NVO",   nameKo: "노보노디스크",   nameEn: "Novo Nordisk",             market: "US", tags: ["비만약", "오젬픽", "ozempic", "위고비", "wegovy"] },
  { symbol: "MRNA",  nameKo: "모더나",         nameEn: "Moderna",                  market: "US", tags: ["백신", "mRNA", "코로나"] },
  { symbol: "BNTX",  nameKo: "바이오엔텍",     nameEn: "BioNTech",                 market: "US", tags: ["백신", "mRNA", "화이자파트너"] },
  { symbol: "PFE",   nameKo: "화이자",         nameEn: "Pfizer",                   market: "US", tags: ["제약", "백신", "코로나"] },
  { symbol: "JNJ",   nameKo: "존슨앤존슨",     nameEn: "Johnson & Johnson",        market: "US", tags: ["제약", "JJ", "헬스케어"] },
  { symbol: "MRK",   nameKo: "머크",           nameEn: "Merck",                    market: "US", tags: ["제약", "바이오", "키트루다"] },
  { symbol: "ABBV",  nameKo: "애브비",         nameEn: "AbbVie",                   market: "US", tags: ["제약", "바이오", "휴미라"] },
  { symbol: "AMGN",  nameKo: "암젠",           nameEn: "Amgen",                    market: "US", tags: ["바이오", "제약"] },
  { symbol: "GILD",  nameKo: "길리어드",       nameEn: "Gilead Sciences",          market: "US", tags: ["바이오", "제약", "에이즈"] },
  { symbol: "HD",    nameKo: "홈디포",         nameEn: "Home Depot",               market: "US", tags: ["홈데포", "인테리어", "건자재"] },
  { symbol: "PG",    nameKo: "P&G",            nameEn: "Procter & Gamble",         market: "US", tags: ["피앤지", "생활용품", "소비재"] },
  { symbol: "KO",    nameKo: "코카콜라",       nameEn: "Coca-Cola",                market: "US", tags: ["콜라", "음료", "코카"] },
  { symbol: "PEP",   nameKo: "펩시",           nameEn: "PepsiCo",                  market: "US", tags: ["펩시콜라", "음료", "과자", "레이즈"] },
  { symbol: "MCD",   nameKo: "맥도날드",       nameEn: "McDonald's",               market: "US", tags: ["햄버거", "맥도", "패스트푸드"] },
  { symbol: "SBUX",  nameKo: "스타벅스",       nameEn: "Starbucks",                market: "US", tags: ["커피", "카페"] },
  { symbol: "NKE",   nameKo: "나이키",         nameEn: "Nike",                     market: "US", tags: ["운동화", "스포츠"] },
  { symbol: "DIS",   nameKo: "디즈니",         nameEn: "Walt Disney",              market: "US", tags: ["미키마우스", "ott", "마블", "스타워즈"] },
  { symbol: "NFLX",  nameKo: "넷플릭스",       nameEn: "Netflix",                  market: "US", tags: ["OTT", "스트리밍", "넷플"] },
  { symbol: "SPOT",  nameKo: "스포티파이",     nameEn: "Spotify",                  market: "US", tags: ["음악스트리밍", "팟캐스트"] },
  { symbol: "UBER",  nameKo: "우버",           nameEn: "Uber",                     market: "US", tags: ["차량공유", "우버이츠", "배달"] },
  { symbol: "ABNB",  nameKo: "에어비앤비",     nameEn: "Airbnb",                   market: "US", tags: ["숙박", "공유숙박"] },
  { symbol: "PYPL",  nameKo: "페이팔",         nameEn: "PayPal",                   market: "US", tags: ["핀테크", "간편결제", "페이"] },
  { symbol: "SQ",    nameKo: "블록",           nameEn: "Block",                    market: "US", tags: ["핀테크", "스퀘어", "캐시앱", "비트코인"] },
  { symbol: "COIN",  nameKo: "코인베이스",     nameEn: "Coinbase",                 market: "US", tags: ["가상자산", "비트코인", "코인", "크립토", "crypto"] },
  { symbol: "PLTR",  nameKo: "팔란티어",       nameEn: "Palantir",                 market: "US", tags: ["AI", "빅데이터", "방산", "팔란"] },
  { symbol: "AMD",   nameKo: "AMD",            nameEn: "Advanced Micro Devices",   market: "US", tags: ["에이엠디", "CPU", "GPU", "반도체", "라이젠"] },
  { symbol: "INTC",  nameKo: "인텔",           nameEn: "Intel",                    market: "US", tags: ["반도체", "CPU", "인텔"] },
  { symbol: "QCOM",  nameKo: "퀄컴",           nameEn: "Qualcomm",                 market: "US", tags: ["반도체", "통신칩", "5G", "스냅드래곤"] },
  { symbol: "TXN",   nameKo: "텍사스인스트루먼트", nameEn: "Texas Instruments",    market: "US", tags: ["반도체", "아날로그반도체"] },
  { symbol: "MU",    nameKo: "마이크론",       nameEn: "Micron Technology",        market: "US", tags: ["반도체", "D램", "DRAM", "낸드", "NAND", "HBM"] },
  { symbol: "LRCX",  nameKo: "램리서치",       nameEn: "Lam Research",             market: "US", tags: ["반도체장비"] },
  { symbol: "AMAT",  nameKo: "어플라이드머티리얼즈", nameEn: "Applied Materials",  market: "US", tags: ["반도체장비"] },
  { symbol: "KLAC",  nameKo: "KLA",            nameEn: "KLA Corporation",          market: "US", tags: ["반도체장비"] },
  { symbol: "ASML",  nameKo: "ASML",           nameEn: "ASML Holdings",            market: "US", tags: ["반도체장비", "EUV", "노광장비", "네덜란드"] },
  { symbol: "TSM",   nameKo: "TSMC",           nameEn: "Taiwan Semiconductor",     market: "US", tags: ["대만반도체", "파운드리", "3나노", "대만"] },
  { symbol: "ARM",   nameKo: "ARM홀딩스",      nameEn: "ARM Holdings",             market: "US", tags: ["반도체", "아키텍처", "모바일칩"] },
  { symbol: "SMCI",  nameKo: "슈퍼마이크로",   nameEn: "Super Micro Computer",     market: "US", tags: ["AI서버", "서버"] },
  { symbol: "MRVL",  nameKo: "마벨",           nameEn: "Marvell Technology",       market: "US", tags: ["반도체", "AI반도체"] },
  { symbol: "ON",    nameKo: "온세미",         nameEn: "ON Semiconductor",         market: "US", tags: ["반도체", "전기차", "SiC"] },
  { symbol: "ORCL",  nameKo: "오라클",         nameEn: "Oracle",                   market: "US", tags: ["데이터베이스", "클라우드", "ERP"] },
  { symbol: "CRM",   nameKo: "세일즈포스",     nameEn: "Salesforce",               market: "US", tags: ["클라우드", "SaaS", "CRM소프트웨어"] },
  { symbol: "NOW",   nameKo: "서비스나우",     nameEn: "ServiceNow",               market: "US", tags: ["클라우드", "SaaS", "엔터프라이즈"] },
  { symbol: "ADBE",  nameKo: "어도비",         nameEn: "Adobe",                    market: "US", tags: ["포토샵", "PDF", "크리에이티브", "AI"] },
  { symbol: "INTU",  nameKo: "인튜이트",       nameEn: "Intuit",                   market: "US", tags: ["세금소프트웨어", "turbotax", "회계"] },
  { symbol: "SNOW",  nameKo: "스노우플레이크", nameEn: "Snowflake",                market: "US", tags: ["클라우드", "데이터", "DW"] },
  { symbol: "DDOG",  nameKo: "데이터독",       nameEn: "Datadog",                  market: "US", tags: ["모니터링", "클라우드", "옵저버빌리티"] },
  { symbol: "NET",   nameKo: "클라우드플레어", nameEn: "Cloudflare",               market: "US", tags: ["CDN", "보안", "클라우드보안"] },
  { symbol: "PANW",  nameKo: "팔로알토",       nameEn: "Palo Alto Networks",       market: "US", tags: ["보안", "사이버보안", "방화벽"] },
  { symbol: "CRWD",  nameKo: "크라우드스트라이크", nameEn: "CrowdStrike",          market: "US", tags: ["보안", "사이버보안", "EDR"] },
  { symbol: "ZS",    nameKo: "지스케일러",     nameEn: "Zscaler",                  market: "US", tags: ["보안", "클라우드보안", "제로트러스트"] },
  { symbol: "IBM",   nameKo: "IBM",            nameEn: "IBM",                      market: "US", tags: ["IT", "컨설팅", "AI", "왓슨"] },
  { symbol: "DELL",  nameKo: "델",             nameEn: "Dell Technologies",        market: "US", tags: ["서버", "컴퓨터", "PC"] },
  { symbol: "ACN",   nameKo: "액센츄어",       nameEn: "Accenture",                market: "US", tags: ["컨설팅", "IT서비스"] },
  { symbol: "GS",    nameKo: "골드만삭스",     nameEn: "Goldman Sachs",            market: "US", tags: ["투자은행", "IB", "월스트리트"] },
  { symbol: "MS",    nameKo: "모건스탠리",     nameEn: "Morgan Stanley",           market: "US", tags: ["투자은행", "IB"] },
  { symbol: "BAC",   nameKo: "뱅크오브아메리카", nameEn: "Bank of America",        market: "US", tags: ["은행", "뱅오아"] },
  { symbol: "WFC",   nameKo: "웰스파고",       nameEn: "Wells Fargo",              market: "US", tags: ["은행"] },
  { symbol: "C",     nameKo: "씨티",           nameEn: "Citigroup",                market: "US", tags: ["씨티그룹", "은행"] },
  { symbol: "XOM",   nameKo: "엑슨모빌",       nameEn: "ExxonMobil",               market: "US", tags: ["석유", "정유", "에너지"] },
  { symbol: "CVX",   nameKo: "쉐브론",         nameEn: "Chevron",                  market: "US", tags: ["석유", "에너지"] },
  { symbol: "BA",    nameKo: "보잉",           nameEn: "Boeing",                   market: "US", tags: ["항공", "비행기", "방산"] },
  { symbol: "RTX",   nameKo: "RTX",            nameEn: "RTX Corporation",          market: "US", tags: ["방산", "항공우주", "레이시온"] },
  { symbol: "LMT",   nameKo: "록히드마틴",     nameEn: "Lockheed Martin",          market: "US", tags: ["방산", "F35", "미사일"] },
  { symbol: "NOC",   nameKo: "노스럽그러먼",   nameEn: "Northrop Grumman",         market: "US", tags: ["방산", "항공우주"] },
  { symbol: "GE",    nameKo: "GE에어로스페이스", nameEn: "GE Aerospace",           market: "US", tags: ["항공엔진", "제너럴일렉트릭"] },
  { symbol: "CAT",   nameKo: "캐터필러",       nameEn: "Caterpillar",              market: "US", tags: ["중장비", "건설기계"] },
  { symbol: "DE",    nameKo: "디어",           nameEn: "Deere & Company",          market: "US", tags: ["농기계", "존디어", "트랙터"] },
  { symbol: "F",     nameKo: "포드",           nameEn: "Ford Motor",               market: "US", tags: ["자동차", "전기차", "머스탱"] },
  { symbol: "GM",    nameKo: "제너럴모터스",   nameEn: "General Motors",           market: "US", tags: ["자동차", "전기차", "쉐보레"] },
  { symbol: "RIVN",  nameKo: "리비안",         nameEn: "Rivian",                   market: "US", tags: ["전기차", "EV", "ev"] },
  { symbol: "LCID",  nameKo: "루시드",         nameEn: "Lucid Group",              market: "US", tags: ["전기차", "EV", "ev"] },
  { symbol: "NIO",   nameKo: "니오",           nameEn: "NIO",                      market: "US", tags: ["중국전기차", "전기차", "EV"] },
  { symbol: "XPEV",  nameKo: "샤오펑",         nameEn: "XPeng",                    market: "US", tags: ["중국전기차", "전기차", "EV"] },
  { symbol: "LI",    nameKo: "리오토",         nameEn: "Li Auto",                  market: "US", tags: ["중국전기차", "전기차"] },
  { symbol: "BABA",  nameKo: "알리바바",       nameEn: "Alibaba",                  market: "US", tags: ["중국주식", "이커머스", "클라우드", "알리"] },
  { symbol: "ENPH",  nameKo: "엔페이즈",       nameEn: "Enphase Energy",           market: "US", tags: ["태양광", "신재생에너지"] },
  { symbol: "FSLR",  nameKo: "퍼스트솔라",     nameEn: "First Solar",              market: "US", tags: ["태양광", "신재생에너지"] },
  { symbol: "NEE",   nameKo: "넥스트에라에너지", nameEn: "NextEra Energy",          market: "US", tags: ["신재생에너지", "유틸리티"] },
  { symbol: "BRK-B", nameKo: "버크셔해서웨이", nameEn: "Berkshire Hathaway B",     market: "US", tags: ["워런버핏", "warren buffett", "투자회사"] },
  { symbol: "APP",   nameKo: "앱러빈",         nameEn: "AppLovin",                 market: "US", tags: ["광고테크", "애드테크", "앱"] },

  // 유통/소비재
  { symbol: "COST",  nameKo: "코스트코",       nameEn: "Costco",                   market: "US", tags: ["창고형마트", "코스코", "멤버십", "도매"] },
  { symbol: "TGT",   nameKo: "타겟",           nameEn: "Target",                   market: "US", tags: ["유통", "마트"] },
  { symbol: "LULU",  nameKo: "룰루레몬",       nameEn: "Lululemon Athletica",      market: "US", tags: ["패션", "요가복", "스포츠웨어"] },

  // 통신
  { symbol: "T",     nameKo: "AT&T",           nameEn: "AT&T Inc.",                market: "US", tags: ["통신", "미국통신", "배당주"] },
  { symbol: "VZ",    nameKo: "버라이즌",       nameEn: "Verizon Communications",   market: "US", tags: ["통신", "미국통신"] },
  { symbol: "TMUS",  nameKo: "T-모바일",       nameEn: "T-Mobile US",              market: "US", tags: ["통신", "5G", "티모바일"] },
  { symbol: "CSCO",  nameKo: "시스코",         nameEn: "Cisco Systems",            market: "US", tags: ["네트워크", "스위치", "라우터", "IT인프라"] },

  // 금융/투자
  { symbol: "AXP",   nameKo: "아메리칸익스프레스", nameEn: "American Express",     market: "US", tags: ["아멕스", "AMEX", "카드", "금융", "워런버핏"] },
  { symbol: "COF",   nameKo: "캐피탈원",       nameEn: "Capital One",             market: "US", tags: ["은행", "카드", "핀테크"] },
  { symbol: "BX",    nameKo: "블랙스톤",       nameEn: "Blackstone",               market: "US", tags: ["사모펀드", "PE", "대체투자", "부동산"] },
  { symbol: "KKR",   nameKo: "KKR",           nameEn: "KKR & Co.",                market: "US", tags: ["사모펀드", "PE", "대체투자"] },
  { symbol: "BLK",   nameKo: "블랙록",         nameEn: "BlackRock",                market: "US", tags: ["자산운용", "ETF", "aum", "iShares"] },
  { symbol: "SCHW",  nameKo: "찰스슈왑",       nameEn: "Charles Schwab",           market: "US", tags: ["증권사", "브로커리지", "ETF"] },
  { symbol: "DKNG",  nameKo: "드래프트킹스",   nameEn: "DraftKings",               market: "US", tags: ["스포츠베팅", "온라인도박", "게임"] },

  // 물류/운송
  { symbol: "FDX",   nameKo: "페덱스",         nameEn: "FedEx Corporation",        market: "US", tags: ["물류", "택배", "항공화물"] },
  { symbol: "UPS",   nameKo: "UPS",            nameEn: "United Parcel Service",    market: "US", tags: ["물류", "택배", "배송"] },
  { symbol: "UNP",   nameKo: "유니온퍼시픽",   nameEn: "Union Pacific",            market: "US", tags: ["철도", "화물"] },
  { symbol: "WM",    nameKo: "웨이스트매니지먼트", nameEn: "Waste Management",     market: "US", tags: ["폐기물", "환경", "쓰레기처리"] },

  // 항공/여행
  { symbol: "DAL",   nameKo: "델타항공",       nameEn: "Delta Air Lines",          market: "US", tags: ["항공", "비행기", "여행"] },
  { symbol: "UAL",   nameKo: "유나이티드항공", nameEn: "United Airlines",          market: "US", tags: ["항공", "비행기", "여행"] },
  { symbol: "AAL",   nameKo: "아메리칸항공",   nameEn: "American Airlines",        market: "US", tags: ["항공", "비행기", "여행"] },
  { symbol: "MAR",   nameKo: "메리어트",       nameEn: "Marriott International",   market: "US", tags: ["호텔", "숙박", "여행"] },
  { symbol: "HLT",   nameKo: "힐튼",           nameEn: "Hilton Worldwide",         market: "US", tags: ["호텔", "숙박", "여행"] },
  { symbol: "CCL",   nameKo: "카니발",         nameEn: "Carnival Corporation",     market: "US", tags: ["크루즈", "여행", "유람선"] },

  // 테크/SNS/미디어
  { symbol: "SHOP",  nameKo: "쇼피파이",       nameEn: "Shopify",                  market: "US", tags: ["이커머스", "쇼핑몰솔루션", "SaaS"] },
  { symbol: "SNAP",  nameKo: "스냅챗",         nameEn: "Snap Inc.",                market: "US", tags: ["SNS", "소셜미디어", "AR", "스냅"] },
  { symbol: "PINS",  nameKo: "핀터레스트",     nameEn: "Pinterest",                market: "US", tags: ["SNS", "소셜미디어", "이미지"] },
  { symbol: "RBLX",  nameKo: "로블록스",       nameEn: "Roblox",                   market: "US", tags: ["게임", "메타버스", "어린이게임"] },
  { symbol: "TTD",   nameKo: "트레이드데스크", nameEn: "The Trade Desk",           market: "US", tags: ["광고테크", "프로그래매틱", "애드테크"] },
  { symbol: "ROKU",  nameKo: "로쿠",           nameEn: "Roku",                     market: "US", tags: ["스트리밍", "IPTV", "CTV", "광고"] },
  { symbol: "WDAY",  nameKo: "워크데이",       nameEn: "Workday",                  market: "US", tags: ["SaaS", "HR소프트웨어", "클라우드", "ERP"] },

  // 글로벌 테크 (중국/신흥국)
  { symbol: "PDD",   nameKo: "PDD홀딩스",      nameEn: "PDD Holdings",             market: "US", tags: ["테무", "temu", "핀둬둬", "중국이커머스", "중국주식"] },
  { symbol: "JD",    nameKo: "징동닷컴",       nameEn: "JD.com",                   market: "US", tags: ["중국이커머스", "중국주식", "중국유통"] },
  { symbol: "BIDU",  nameKo: "바이두",         nameEn: "Baidu",                    market: "US", tags: ["중국구글", "AI", "검색엔진", "중국주식"] },
  { symbol: "MELI",  nameKo: "메르카도리브레", nameEn: "MercadoLibre",             market: "US", tags: ["남미이커머스", "핀테크", "라틴아메리카"] },
  { symbol: "SE",    nameKo: "씨리미티드",     nameEn: "Sea Limited",              market: "US", tags: ["동남아", "쇼피", "shopee", "게임", "가레나"] },

  // 핀테크/신금융
  { symbol: "SOFI",  nameKo: "소파이",         nameEn: "SoFi Technologies",        market: "US", tags: ["핀테크", "인터넷은행", "대출", "학자금"] },
  { symbol: "AFRM",  nameKo: "어펌",           nameEn: "Affirm Holdings",          market: "US", tags: ["BNPL", "후불결제", "핀테크"] },
  { symbol: "HOOD",  nameKo: "로빈후드",       nameEn: "Robinhood Markets",        market: "US", tags: ["주식앱", "핀테크", "MFA", "무수수료"] },

  // 에너지/전력/인프라
  { symbol: "CEG",   nameKo: "컨스텔레이션에너지", nameEn: "Constellation Energy",  market: "US", tags: ["원전", "핵발전", "클린에너지", "AI전력"] },
  { symbol: "GEV",   nameKo: "GE버노바",       nameEn: "GE Vernova",               market: "US", tags: ["전력", "풍력", "가스터빈", "에너지인프라"] },
  { symbol: "VST",   nameKo: "비스트라",       nameEn: "Vistra Corp",              market: "US", tags: ["원전", "전력", "클린에너지", "AI전력"] },
  { symbol: "ETN",   nameKo: "이튼",           nameEn: "Eaton Corporation",        market: "US", tags: ["전력관리", "전기설비", "에너지인프라"] },
  { symbol: "LIN",   nameKo: "린데",           nameEn: "Linde plc",                market: "US", tags: ["산업가스", "수소", "화학"] },

  // 리츠/부동산
  { symbol: "AMT",   nameKo: "아메리칸타워",   nameEn: "American Tower",           market: "US", tags: ["리츠", "통신탑", "REIT", "인프라"] },
  { symbol: "O",     nameKo: "리얼티인컴",     nameEn: "Realty Income",            market: "US", tags: ["리츠", "REIT", "배당주", "월배당"] },
  { symbol: "SPG",   nameKo: "사이먼프로퍼티", nameEn: "Simon Property Group",     market: "US", tags: ["리츠", "REIT", "쇼핑몰", "부동산"] },

  // 헬스케어 추가
  { symbol: "TMO",   nameKo: "써모피셔",       nameEn: "Thermo Fisher Scientific", market: "US", tags: ["의료기기", "바이오장비", "연구장비"] },
  { symbol: "DHR",   nameKo: "다나허",         nameEn: "Danaher Corporation",      market: "US", tags: ["의료기기", "바이오장비", "진단"] },
  { symbol: "ABT",   nameKo: "애보트",         nameEn: "Abbott Laboratories",      market: "US", tags: ["의료기기", "진단", "CGM", "당뇨"] },
  { symbol: "ISRG",  nameKo: "인튜이티브서지컬", nameEn: "Intuitive Surgical",   market: "US", tags: ["수술로봇", "다빈치", "로봇수술", "의료기기"] },
  { symbol: "CVS",   nameKo: "CVS헬스",        nameEn: "CVS Health",               market: "US", tags: ["약국", "헬스케어", "보험", "CVS약국"] },
  { symbol: "ELV",   nameKo: "엘레번스헬스",   nameEn: "Elevance Health",          market: "US", tags: ["건강보험", "의료보험", "헬스케어"] },

  // 신흥 테마
  { symbol: "IONQ",  nameKo: "아이온큐",       nameEn: "IonQ",                     market: "US", tags: ["양자컴퓨팅", "퀀텀컴퓨팅", "quantum"] },
  { symbol: "RGTI",  nameKo: "리게티컴퓨팅",   nameEn: "Rigetti Computing",        market: "US", tags: ["양자컴퓨팅", "퀀텀컴퓨팅", "quantum"] },
  { symbol: "RKLB",  nameKo: "로켓랩",         nameEn: "Rocket Lab USA",           market: "US", tags: ["우주", "로켓", "발사체", "뉴스페이스"] },
  { symbol: "JOBY",  nameKo: "조비에비에이션", nameEn: "Joby Aviation",            market: "US", tags: ["에어택시", "UAM", "전동항공", "도심항공"] },
  { symbol: "ACHR",  nameKo: "아처에비에이션", nameEn: "Archer Aviation",          market: "US", tags: ["에어택시", "UAM", "전동항공"] },
  { symbol: "SOUN",  nameKo: "사운드하운드",   nameEn: "SoundHound AI",            market: "US", tags: ["AI음성", "음성인식", "AI"] },
  { symbol: "HIMS",  nameKo: "힘스앤허스",     nameEn: "Hims & Hers Health",       market: "US", tags: ["헬스케어", "탈모약", "비만약", "DTC"] },

  // ── 한국 주식(KOSPI / KS) ─────────────────────────────────────
  { symbol: "005930", nameKo: "삼성전자",           nameEn: "Samsung Electronics",      market: "KS", tags: ["삼성", "samsung", "반도체", "스마트폰", "갤럭시", "HBM"] },
  { symbol: "000660", nameKo: "SK하이닉스",          nameEn: "SK Hynix",                 market: "KS", tags: ["하이닉스", "hynix", "반도체", "D램", "HBM", "AI메모리"] },
  { symbol: "035420", nameKo: "NAVER",               nameEn: "NAVER",                    market: "KS", tags: ["네이버", "검색", "클라우드", "웹툰", "쇼핑"] },
  { symbol: "035720", nameKo: "카카오",              nameEn: "Kakao",                    market: "KS", tags: ["카카오", "카톡", "카카오톡", "플랫폼"] },
  { symbol: "005380", nameKo: "현대차",              nameEn: "Hyundai Motor",            market: "KS", tags: ["현대자동차", "자동차", "EV", "수소차"] },
  { symbol: "000270", nameKo: "기아",                nameEn: "Kia",                      market: "KS", tags: ["기아차", "자동차", "EV"] },
  { symbol: "051910", nameKo: "LG화학",              nameEn: "LG Chem",                  market: "KS", tags: ["배터리", "화학", "양극재", "소재"] },
  { symbol: "006400", nameKo: "삼성SDI",             nameEn: "Samsung SDI",              market: "KS", tags: ["배터리", "SDI", "전기차배터리"] },
  { symbol: "207940", nameKo: "삼성바이오로직스",    nameEn: "Samsung Biologics",        market: "KS", tags: ["바이오", "삼성", "CMO", "바이오시밀러"] },
  { symbol: "012330", nameKo: "현대모비스",          nameEn: "Hyundai Mobis",            market: "KS", tags: ["자동차부품", "현대"] },
  { symbol: "068270", nameKo: "셀트리온",            nameEn: "Celltrion",                market: "KS", tags: ["바이오", "바이오시밀러", "제약"] },
  { symbol: "028260", nameKo: "삼성물산",            nameEn: "Samsung C&T",              market: "KS", tags: ["삼성", "건설", "지주"] },
  { symbol: "105560", nameKo: "KB금융",              nameEn: "KB Financial Group",       market: "KS", tags: ["KB", "국민은행", "은행", "금융"] },
  { symbol: "055550", nameKo: "신한지주",            nameEn: "Shinhan Financial",        market: "KS", tags: ["신한은행", "금융", "은행"] },
  { symbol: "086790", nameKo: "하나금융지주",        nameEn: "Hana Financial Group",     market: "KS", tags: ["하나은행", "금융", "은행"] },
  { symbol: "316140", nameKo: "우리금융지주",        nameEn: "Woori Financial Group",    market: "KS", tags: ["우리은행", "금융"] },
  { symbol: "024110", nameKo: "기업은행",            nameEn: "Industrial Bank of Korea", market: "KS", tags: ["IBK", "은행", "중소기업"] },
  { symbol: "032830", nameKo: "삼성생명",            nameEn: "Samsung Life Insurance",   market: "KS", tags: ["보험", "삼성", "생명보험"] },
  { symbol: "088350", nameKo: "한화생명",            nameEn: "Hanwha Life Insurance",    market: "KS", tags: ["보험", "한화"] },
  { symbol: "030200", nameKo: "KT",                  nameEn: "KT Corporation",           market: "KS", tags: ["통신", "케이티", "인터넷", "5G"] },
  { symbol: "017670", nameKo: "SK텔레콤",            nameEn: "SK Telecom",               market: "KS", tags: ["통신", "SKT", "5G", "AI통신"] },
  { symbol: "015760", nameKo: "한국전력",            nameEn: "Korea Electric Power",     market: "KS", tags: ["전력", "한전", "유틸리티"] },
  { symbol: "066570", nameKo: "LG전자",              nameEn: "LG Electronics",           market: "KS", tags: ["가전", "LG", "TV", "OLED"] },
  { symbol: "003550", nameKo: "LG",                  nameEn: "LG Corporation",           market: "KS", tags: ["LG지주", "지주사"] },
  { symbol: "011070", nameKo: "LG이노텍",            nameEn: "LG Innotek",               market: "KS", tags: ["부품", "카메라모듈", "LG", "아이폰부품"] },
  { symbol: "096770", nameKo: "SK이노베이션",        nameEn: "SK Innovation",            market: "KS", tags: ["배터리", "에너지", "SK", "정유"] },
  { symbol: "009150", nameKo: "삼성전기",            nameEn: "Samsung Electro-Mechanics",market: "KS", tags: ["삼성", "MLCC", "전자부품", "카메라모듈"] },
  { symbol: "000810", nameKo: "삼성화재",            nameEn: "Samsung Fire & Marine",    market: "KS", tags: ["보험", "삼성", "손해보험"] },
  { symbol: "005490", nameKo: "POSCO홀딩스",         nameEn: "POSCO Holdings",           market: "KS", tags: ["철강", "포스코", "2차전지소재", "리튬"] },
  { symbol: "003670", nameKo: "포스코퓨처엠",        nameEn: "POSCO Future M",           market: "KS", tags: ["배터리소재", "포스코", "양극재", "음극재"] },
  { symbol: "011200", nameKo: "HMM",                 nameEn: "HMM",                      market: "KS", tags: ["해운", "컨테이너선", "현대상선"] },
  { symbol: "018260", nameKo: "삼성에스디에스",      nameEn: "Samsung SDS",              market: "KS", tags: ["IT서비스", "삼성", "물류"] },
  { symbol: "009830", nameKo: "한화솔루션",          nameEn: "Hanwha Solutions",         market: "KS", tags: ["태양광", "한화", "신재생에너지"] },
  { symbol: "034730", nameKo: "SK",                  nameEn: "SK Inc.",                  market: "KS", tags: ["SK지주", "지주사"] },
  { symbol: "010950", nameKo: "S-Oil",               nameEn: "S-Oil Corporation",        market: "KS", tags: ["정유", "석유", "에너지"] },
  { symbol: "271560", nameKo: "오리온",              nameEn: "Orion",                    market: "KS", tags: ["과자", "식품", "초코파이", "소비재"] },
  { symbol: "352820", nameKo: "HYBE",                nameEn: "HYBE",                     market: "KS", tags: ["BTS", "아이돌", "엔터", "하이브", "k팝", "kpop"] },
  { symbol: "041510", nameKo: "SM엔터테인먼트",      nameEn: "SM Entertainment",         market: "KQ", tags: ["엔터", "아이돌", "SM", "k팝"] },
  { symbol: "035900", nameKo: "JYP Ent.",            nameEn: "JYP Entertainment",        market: "KQ", tags: ["엔터", "트와이스", "JYP", "k팝"] },
  { symbol: "122870", nameKo: "와이지엔터테인먼트", nameEn: "YG Entertainment",         market: "KQ", tags: ["엔터", "블랙핑크", "YG", "k팝"] },
  { symbol: "259960", nameKo: "크래프톤",            nameEn: "Krafton",                  market: "KS", tags: ["게임", "배그", "배틀그라운드", "PUBG"] },
  { symbol: "042700", nameKo: "한미반도체",          nameEn: "Hanmi Semiconductor",      market: "KS", tags: ["반도체장비", "HBM", "TC본더"] },
  { symbol: "079550", nameKo: "LIG넥스원",           nameEn: "LIG Nex1",                 market: "KS", tags: ["방산", "방위산업", "미사일"] },
  { symbol: "012450", nameKo: "한화에어로스페이스",  nameEn: "Hanwha Aerospace",         market: "KS", tags: ["방산", "항공엔진", "한화", "K9자주포"] },
  { symbol: "064350", nameKo: "현대로템",            nameEn: "Hyundai Rotem",            market: "KS", tags: ["방산", "K2전차", "철도"] },
  { symbol: "090430", nameKo: "아모레퍼시픽",        nameEn: "Amorepacific",             market: "KS", tags: ["화장품", "설화수", "K뷰티", "코스메틱"] },
  { symbol: "097950", nameKo: "CJ제일제당",          nameEn: "CJ CheilJedang",           market: "KS", tags: ["식품", "비비고", "CJ"] },
  { symbol: "000120", nameKo: "CJ대한통운",          nameEn: "CJ Logistics",             market: "KS", tags: ["물류", "택배", "CJ"] },
  { symbol: "003490", nameKo: "대한항공",            nameEn: "Korean Air",               market: "KS", tags: ["항공", "비행기", "KAL"] },
  { symbol: "010130", nameKo: "고려아연",            nameEn: "Korea Zinc",               market: "KS", tags: ["아연", "비철금속", "이차전지소재"] },
  { symbol: "241560", nameKo: "두산밥캣",            nameEn: "Doosan Bobcat",            market: "KS", tags: ["건설기계", "중장비", "밥캣"] },
  { symbol: "034020", nameKo: "두산에너빌리티",      nameEn: "Doosan Enerbility",        market: "KS", tags: ["원전", "풍력", "에너지", "두산"] },
  { symbol: "000100", nameKo: "유한양행",            nameEn: "Yuhan Corporation",        market: "KS", tags: ["제약", "신약"] },
  { symbol: "128940", nameKo: "한미약품",            nameEn: "Hanmi Pharmaceutical",     market: "KS", tags: ["제약", "바이오", "신약"] },
  { symbol: "377300", nameKo: "카카오페이",          nameEn: "Kakao Pay",                market: "KS", tags: ["핀테크", "간편결제", "카카오"] },
  { symbol: "323410", nameKo: "카카오뱅크",          nameEn: "Kakao Bank",               market: "KS", tags: ["인터넷은행", "카카오", "은행"] },
  { symbol: "006800", nameKo: "미래에셋증권",        nameEn: "Mirae Asset Securities",   market: "KS", tags: ["증권", "투자", "금융"] },
  { symbol: "071050", nameKo: "한국금융지주",        nameEn: "Korea Investment Holdings",market: "KS", tags: ["증권", "한투", "금융"] },
  { symbol: "036570", nameKo: "엔씨소프트",         nameEn: "NC Soft",                  market: "KS", tags: ["게임", "리니지", "NC"] },
  { symbol: "251270", nameKo: "넷마블",              nameEn: "Netmarble",                market: "KS", tags: ["게임", "모바일게임"] },
  { symbol: "078930", nameKo: "GS",                  nameEn: "GS Holdings",              market: "KS", tags: ["GS지주", "정유", "편의점", "GS25"] },
  { symbol: "180640", nameKo: "한진칼",              nameEn: "Hanjin KAL",               market: "KS", tags: ["대한항공", "항공", "물류"] },
  { symbol: "326030", nameKo: "SK바이오팜",          nameEn: "SK Biopharmaceuticals",    market: "KS", tags: ["제약", "바이오", "뇌전증"] },

  // 조선
  { symbol: "042660", nameKo: "한화오션",            nameEn: "Hanwha Ocean",             market: "KS", tags: ["조선", "해양", "방산", "LNG선", "잠수함"] },
  { symbol: "329180", nameKo: "HD현대중공업",         nameEn: "HD Hyundai Heavy Industries", market: "KS", tags: ["조선", "LNG선", "해양플랜트", "HD현대"] },
  { symbol: "010140", nameKo: "삼성중공업",           nameEn: "Samsung Heavy Industries",  market: "KS", tags: ["조선", "LNG선", "드릴쉽", "삼성"] },
  { symbol: "009540", nameKo: "HD한국조선해양",       nameEn: "HD Korea Shipbuilding",     market: "KS", tags: ["조선지주", "HD현대", "조선"] },
  { symbol: "267250", nameKo: "HD현대",               nameEn: "HD Hyundai",               market: "KS", tags: ["HD지주", "조선", "현대"] },

  // 디스플레이/부품
  { symbol: "034220", nameKo: "LG디스플레이",         nameEn: "LG Display",               market: "KS", tags: ["OLED", "디스플레이", "패널", "LG"] },

  // 통신
  { symbol: "032640", nameKo: "LG유플러스",           nameEn: "LG Uplus",                 market: "KS", tags: ["통신", "LGU+", "5G", "인터넷"] },
  { symbol: "033780", nameKo: "KT&G",                nameEn: "KT&G Corporation",         market: "KS", tags: ["담배", "건강기능식품", "부동산"] },

  // 식품/소비재
  { symbol: "003230", nameKo: "삼양식품",             nameEn: "Samyang Foods",             market: "KS", tags: ["불닭볶음면", "라면", "식품", "수출", "삼양"] },
  { symbol: "007310", nameKo: "오뚜기",               nameEn: "Ottogi Corporation",        market: "KS", tags: ["식품", "라면", "카레", "마요네즈"] },
  { symbol: "004370", nameKo: "농심",                 nameEn: "Nongshim",                 market: "KS", tags: ["라면", "신라면", "식품", "수출"] },
  { symbol: "280360", nameKo: "롯데웰푸드",           nameEn: "Lotte Wellfood",           market: "KS", tags: ["식품", "과자", "롯데", "빙과"] },

  // 금융 추가
  { symbol: "138040", nameKo: "메리츠금융지주",       nameEn: "Meritz Financial Group",   market: "KS", tags: ["금융", "보험", "증권", "메리츠"] },
  { symbol: "005940", nameKo: "NH투자증권",           nameEn: "NH Investment Securities", market: "KS", tags: ["증권", "NH", "투자"] },
  { symbol: "039490", nameKo: "키움증권",             nameEn: "Kiwoom Securities",        market: "KS", tags: ["증권", "키움", "HTS", "영웅문"] },

  // 유통
  { symbol: "139480", nameKo: "이마트",               nameEn: "E-Mart",                   market: "KS", tags: ["유통", "마트", "신세계", "쓱닷컴"] },
  { symbol: "282330", nameKo: "BGF리테일",            nameEn: "BGF Retail",               market: "KS", tags: ["편의점", "CU", "유통"] },
  { symbol: "069960", nameKo: "현대백화점",           nameEn: "Hyundai Department Store",  market: "KS", tags: ["백화점", "유통", "현대"] },
  { symbol: "023530", nameKo: "롯데쇼핑",             nameEn: "Lotte Shopping",           market: "KS", tags: ["롯데", "백화점", "마트", "유통"] },

  // 화장품/뷰티
  { symbol: "051900", nameKo: "LG생활건강",           nameEn: "LG Household & Health Care", market: "KS", tags: ["화장품", "후", "K뷰티", "생활용품", "LG"] },
  { symbol: "161890", nameKo: "한국콜마",             nameEn: "Kolmar Korea",             market: "KS", tags: ["화장품", "ODM", "OEM", "K뷰티"] },
  { symbol: "192820", nameKo: "코스맥스",             nameEn: "Cosmax",                   market: "KS", tags: ["화장품", "ODM", "OEM", "K뷰티"] },

  // 제약/바이오
  { symbol: "069620", nameKo: "대웅제약",             nameEn: "Daewoong Pharmaceutical",  market: "KS", tags: ["제약", "나보타", "보톡스", "신약"] },
  { symbol: "302440", nameKo: "SK바이오사이언스",      nameEn: "SK Bioscience",            market: "KS", tags: ["백신", "바이오", "SK", "mRNA"] },
  { symbol: "170900", nameKo: "동아쏘시오홀딩스",     nameEn: "Dong-A Socio Holdings",    market: "KS", tags: ["제약", "동아제약", "박카스"] },

  // 건설/중공업
  { symbol: "000720", nameKo: "현대건설",             nameEn: "Hyundai Engineering & Construction", market: "KS", tags: ["건설", "현대", "플랜트"] },
  { symbol: "028050", nameKo: "삼성엔지니어링",       nameEn: "Samsung Engineering",      market: "KS", tags: ["건설", "플랜트", "삼성", "EPC"] },
  { symbol: "047050", nameKo: "포스코인터내셔널",     nameEn: "POSCO International",      market: "KS", tags: ["무역", "포스코", "에너지", "LNG"] },

  // ── 한국 주식(KOSDAQ / KQ) ────────────────────────────────────
  { symbol: "086520", nameKo: "에코프로",            nameEn: "EcoPro",                   market: "KQ", tags: ["2차전지", "배터리소재", "에코", "지주"] },
  { symbol: "247540", nameKo: "에코프로비엠",        nameEn: "EcoPro BM",                market: "KQ", tags: ["2차전지", "양극재", "배터리소재", "에코"] },
  { symbol: "293490", nameKo: "카카오게임즈",        nameEn: "Kakao Games",              market: "KQ", tags: ["게임", "카카오", "모바일게임"] },
  { symbol: "357780", nameKo: "솔브레인",            nameEn: "Soulbrain",                market: "KQ", tags: ["반도체소재", "화학"] },
  { symbol: "086900", nameKo: "메디톡스",            nameEn: "Medytox",                  market: "KQ", tags: ["바이오", "보톡스", "미용"] },
  { symbol: "145020", nameKo: "휴젤",                nameEn: "Hugel",                    market: "KQ", tags: ["바이오", "보톡스", "필러", "미용"] },
  { symbol: "336260", nameKo: "두산퓨얼셀",          nameEn: "Doosan Fuel Cell",         market: "KS", tags: ["수소", "연료전지", "신재생에너지"] },

  // 바이오/헬스케어
  { symbol: "196170", nameKo: "알테오젠",             nameEn: "Alteogen",                 market: "KQ", tags: ["바이오", "항체약물접합", "ADC", "피하주사", "신약"] },
  { symbol: "328130", nameKo: "루닛",                 nameEn: "Lunit",                    market: "KQ", tags: ["AI의료", "의료AI", "암진단", "병리"] },
  { symbol: "214150", nameKo: "클래시스",             nameEn: "Classys",                  market: "KQ", tags: ["의료기기", "미용기기", "슈링크", "울쎄라"] },
  { symbol: "096530", nameKo: "씨젠",                 nameEn: "Seegene",                  market: "KQ", tags: ["진단", "PCR", "분자진단", "코로나"] },
  { symbol: "950130", nameKo: "엑세스바이오",         nameEn: "Access Bio",               market: "KQ", tags: ["진단", "신속진단", "말라리아"] },
  { symbol: "214370", nameKo: "케어젠",               nameEn: "Caregen",                  market: "KQ", tags: ["바이오", "펩타이드", "탈모", "미용"] },
  { symbol: "377450", nameKo: "리가켐바이오",         nameEn: "LegaChem Biosciences",     market: "KQ", tags: ["바이오", "ADC", "항체약물접합", "신약"] },

  // 보안/소프트웨어
  { symbol: "053800", nameKo: "안랩",                 nameEn: "AhnLab",                   market: "KQ", tags: ["보안", "백신", "사이버보안", "V3"] },
  { symbol: "036030", nameKo: "KG이니시스",           nameEn: "KG Inicis",                market: "KQ", tags: ["결제", "PG", "핀테크"] },

  // 게임
  { symbol: "263750", nameKo: "펄어비스",             nameEn: "Pearl Abyss",              market: "KQ", tags: ["게임", "검은사막", "MMORPG", "도깨비"] },
  { symbol: "112040", nameKo: "위메이드",             nameEn: "Wemade",                   market: "KQ", tags: ["게임", "미르", "블록체인게임", "위믹스", "P2E"] },
  { symbol: "194480", nameKo: "데브시스터즈",         nameEn: "Devsisters",               market: "KQ", tags: ["게임", "쿠키런", "모바일게임"] },
  { symbol: "053580", nameKo: "웹젠",                 nameEn: "Webzen",                   market: "KQ", tags: ["게임", "뮤", "MU", "MMORPG"] },
  { symbol: "225570", nameKo: "넥슨게임즈",           nameEn: "Nexon Games",              market: "KQ", tags: ["게임", "블루아카이브", "넥슨"] },

  // 반도체 장비/소재
  { symbol: "348210", nameKo: "넥스틴",               nameEn: "Nextin",                   market: "KQ", tags: ["반도체장비", "검사장비", "웨이퍼"] },
  { symbol: "131970", nameKo: "테크윙",               nameEn: "Techwing",                 market: "KQ", tags: ["반도체장비", "핸들러", "테스트"] },
  { symbol: "290510", nameKo: "에스앤에스텍",         nameEn: "S&S Tech",                 market: "KQ", tags: ["반도체소재", "블랭크마스크", "포토마스크"] },
  { symbol: "104830", nameKo: "원익머트리얼즈",       nameEn: "Wonik Materials",           market: "KQ", tags: ["반도체소재", "특수가스", "전구체"] },

  // 엔터/콘텐츠
  { symbol: "263720", nameKo: "디어유",               nameEn: "DearU",                    market: "KQ", tags: ["팬덤", "버블", "아이돌", "k팝", "SM"] },

  // 2차전지/소재
  { symbol: "064760", nameKo: "티씨케이",             nameEn: "TcK",                      market: "KQ", tags: ["반도체소재", "실리콘카바이드", "SiC", "흑연"] },
  { symbol: "336370", nameKo: "솔루스첨단소재",       nameEn: "Solus Advanced Materials", market: "KQ", tags: ["2차전지", "동박", "배터리소재"] },

  // ── 2026 신규 추가 (미국) ─────────────────────────────────────
  // 비트코인 관련
  { symbol: "MSTR",  nameKo: "스트래티지",     nameEn: "Strategy (MicroStrategy)",  market: "US", tags: ["비트코인", "bitcoin", "BTC", "마이크로스트래티지", "가상자산"] },
  { symbol: "MARA",  nameKo: "마라톤디지털",   nameEn: "Marathon Digital Holdings", market: "US", tags: ["비트코인채굴", "bitcoin", "BTC", "채굴", "가상자산"] },
  { symbol: "RIOT",  nameKo: "라이엇플랫폼스", nameEn: "Riot Platforms",            market: "US", tags: ["비트코인채굴", "bitcoin", "BTC", "채굴", "가상자산"] },
  { symbol: "CORZ",  nameKo: "코어사이언티픽", nameEn: "Core Scientific",           market: "US", tags: ["비트코인채굴", "AI데이터센터", "bitcoin", "HPC"] },
  { symbol: "HUT",   nameKo: "헛8코퍼레이션", nameEn: "Hut 8 Corp",               market: "US", tags: ["비트코인채굴", "bitcoin", "BTC", "채굴"] },
  { symbol: "IREN",  nameKo: "아이리스에너지",  nameEn: "Iris Energy",              market: "US", tags: ["비트코인채굴", "AI데이터센터", "bitcoin", "클린에너지"] },
  // SNS / 커뮤니티
  { symbol: "RDDT",  nameKo: "레딧",           nameEn: "Reddit",                    market: "US", tags: ["SNS", "소셜미디어", "커뮤니티", "밈", "인터넷"] },
  { symbol: "DJT",   nameKo: "트럼프미디어",   nameEn: "Trump Media & Technology",  market: "US", tags: ["트럼프", "SNS", "Truth Social", "밈주식", "MAGA"] },
  // 외식 / 소비
  { symbol: "CAVA",  nameKo: "카바",           nameEn: "CAVA Group",                market: "US", tags: ["레스토랑", "패스트캐주얼", "지중해음식", "외식"] },
  { symbol: "DASH",  nameKo: "도어대시",       nameEn: "DoorDash",                  market: "US", tags: ["배달", "음식배달", "배달앱", "푸드테크"] },
  { symbol: "CMG",   nameKo: "치폴레",         nameEn: "Chipotle Mexican Grill",    market: "US", tags: ["레스토랑", "패스트캐주얼", "부리토", "멕시코음식"] },
  { symbol: "WING",  nameKo: "윙스탑",         nameEn: "Wingstop",                  market: "US", tags: ["레스토랑", "치킨윙", "패스트푸드", "외식"] },
  { symbol: "CELH",  nameKo: "셀시우스",       nameEn: "Celsius Holdings",          market: "US", tags: ["에너지음료", "음료", "피트니스", "헬스"] },
  { symbol: "CHWY",  nameKo: "츄이",           nameEn: "Chewy",                     market: "US", tags: ["반려동물", "펫푸드", "이커머스", "펫"] },
  // 모빌리티
  { symbol: "LYFT",  nameKo: "리프트",         nameEn: "Lyft",                      market: "US", tags: ["차량공유", "라이드쉐어링", "모빌리티"] },
  // 사이버보안
  { symbol: "FTNT",  nameKo: "포티넷",         nameEn: "Fortinet",                  market: "US", tags: ["사이버보안", "방화벽", "네트워크보안", "보안"] },
  { symbol: "S",     nameKo: "센티넬원",       nameEn: "SentinelOne",               market: "US", tags: ["사이버보안", "EDR", "XDR", "AI보안", "보안"] },
  { symbol: "OKTA",  nameKo: "옥타",           nameEn: "Okta",                      market: "US", tags: ["보안", "IAM", "인증", "ID보안", "제로트러스트"] },
  // 헬스케어
  { symbol: "DXCM",  nameKo: "덱스콤",         nameEn: "Dexcom",                    market: "US", tags: ["CGM", "혈당", "당뇨", "의료기기", "웨어러블"] },
  { symbol: "ELF",   nameKo: "이엘에프뷰티",   nameEn: "e.l.f. Beauty",             market: "US", tags: ["화장품", "뷰티", "저가화장품", "K뷰티"] },
  // 스페이스
  { symbol: "ASTS",  nameKo: "AST스페이스모바일", nameEn: "AST SpaceMobile",        market: "US", tags: ["위성인터넷", "우주통신", "저궤도위성", "5G"] },
  { symbol: "LUNR",  nameKo: "인튜이티브머신스", nameEn: "Intuitive Machines",      market: "US", tags: ["우주", "달착륙", "NASA", "뉴스페이스"] },
  // AI 인프라
  { symbol: "APLD",  nameKo: "어플라이드디지털", nameEn: "Applied Digital",         market: "US", tags: ["AI데이터센터", "HPC", "클라우드", "GPU서버"] },
  // 교육/콘텐츠
  { symbol: "DUOL",  nameKo: "듀오링고",       nameEn: "Duolingo",                  market: "US", tags: ["언어학습", "교육", "에드테크", "AI"] },
  // 방산/테크
  { symbol: "AXON",  nameKo: "액손엔터프라이즈", nameEn: "Axon Enterprise",         market: "US", tags: ["테이저", "경찰장비", "보안", "드론", "카메라"] },
  // 동남아
  { symbol: "GRAB",  nameKo: "그랩",           nameEn: "Grab Holdings",             market: "US", tags: ["동남아", "슈퍼앱", "배달", "핀테크", "배달앱"] },
  // 밈/게임
  { symbol: "GME",   nameKo: "게임스탑",       nameEn: "GameStop",                  market: "US", tags: ["밈주식", "게임", "공매도", "meme"] },
  // SaaS
  { symbol: "ZM",    nameKo: "줌",             nameEn: "Zoom Video Communications", market: "US", tags: ["화상회의", "재택근무", "SaaS", "협업"] },

  // ── 2026 신규 추가 (한국 KOSPI) ──────────────────────────────
  { symbol: "373220", nameKo: "LG에너지솔루션",    nameEn: "LG Energy Solution",       market: "KS", tags: ["배터리", "전기차배터리", "LG", "LGES", "파우치형"] },
  { symbol: "267260", nameKo: "HD현대일렉트릭",    nameEn: "HD Hyundai Electric",      market: "KS", tags: ["전력기기", "변압기", "전력설비", "AI전력", "HD현대"] },
  { symbol: "298040", nameKo: "효성중공업",        nameEn: "Hyosung Heavy Industries", market: "KS", tags: ["전력기기", "변압기", "전력설비", "효성", "초고압"] },
  { symbol: "010120", nameKo: "LS ELECTRIC",       nameEn: "LS Electric",              market: "KS", tags: ["전력기기", "배전반", "ESS", "전력설비", "LS"] },
  { symbol: "006260", nameKo: "LS",                nameEn: "LS Corporation",           market: "KS", tags: ["LS지주", "전선", "구리", "산업재"] },
  { symbol: "443060", nameKo: "HD현대마린솔루션",  nameEn: "HD Hyundai Marine Solution", market: "KS", tags: ["선박엔진정비", "MRO", "선박", "HD현대", "해양"] },
  { symbol: "022100", nameKo: "포스코DX",          nameEn: "POSCO DX",                 market: "KS", tags: ["IT서비스", "스마트팩토리", "포스코", "AI", "자동화"] },
  { symbol: "007660", nameKo: "이수페타시스",      nameEn: "ISU Petasys",              market: "KS", tags: ["PCB", "AI서버PCB", "고다층기판", "MLB"] },
  { symbol: "008060", nameKo: "대덕전자",          nameEn: "Daeduck Electronics",      market: "KS", tags: ["PCB", "기판", "반도체패키지", "MLB"] },
  { symbol: "000880", nameKo: "한화",              nameEn: "Hanwha Corporation",       market: "KS", tags: ["한화그룹", "방산", "화약", "지주"] },
  { symbol: "047810", nameKo: "한국항공우주",      nameEn: "Korea Aerospace Industries", market: "KS", tags: ["항공", "방산", "KAI", "전투기", "FA50"] },

  // ── 2026 신규 추가 (한국 KOSDAQ) ─────────────────────────────
  { symbol: "277810", nameKo: "레인보우로보틱스",  nameEn: "Rainbow Robotics",         market: "KQ", tags: ["로봇", "휴머노이드", "삼성로봇", "협동로봇", "자율주행"] },
  { symbol: "399720", nameKo: "가온칩스",          nameEn: "Gaon Chip",                market: "KQ", tags: ["AI반도체", "칩설계", "반도체IP", "GPU", "팹리스"] },
  { symbol: "432720", nameKo: "퀄리타스반도체",    nameEn: "Qualitas Semiconductor",   market: "KQ", tags: ["AI반도체", "칩설계", "반도체IP", "팹리스"] },
  { symbol: "394280", nameKo: "오픈엣지테크놀로지", nameEn: "OpenEdge Technology",     market: "KQ", tags: ["AI반도체", "칩설계", "NPU", "팹리스"] },
  { symbol: "066970", nameKo: "엘앤에프",          nameEn: "L&F",                      market: "KQ", tags: ["양극재", "2차전지소재", "배터리소재", "엘앤에프"] },
  { symbol: "222800", nameKo: "심텍",              nameEn: "Simtech",                  market: "KQ", tags: ["PCB", "반도체패키지", "메모리모듈"] },
  { symbol: "039030", nameKo: "이오테크닉스",      nameEn: "EO Technics",              market: "KQ", tags: ["반도체장비", "레이저마킹", "다이싱"] },
  { symbol: "403870", nameKo: "HPSP",              nameEn: "HPSP",                     market: "KQ", tags: ["반도체장비", "고압수소어닐링", "HPM"] },
  { symbol: "131290", nameKo: "티에스이",          nameEn: "TSE",                      market: "KQ", tags: ["반도체장비", "테스트소켓", "프로브카드"] },
  { symbol: "460930", nameKo: "현대힘스",          nameEn: "Hyundai Hims",             market: "KQ", tags: ["방산부품", "현대로템", "장갑차"] },
];

export const STOCKS: Stock[] = [...CURATED_STOCKS, ...GENERATED_STOCKS];

function scoreStock(stock: Stock, query: string): number {
  const q = query.toLowerCase().trim();
  const symbol = stock.symbol.toLowerCase();
  const nameKo = stock.nameKo.toLowerCase();
  const nameEn = stock.nameEn.toLowerCase();

  let score = 0;

  if (symbol === q) {
    score = Math.max(score, 100);
  } else if (symbol.startsWith(q)) {
    score = Math.max(score, 82);
  } else if (symbol.replace("-", ".").startsWith(q) || symbol.replace(".", "-").startsWith(q)) {
    score = Math.max(score, 80);
  } else if (symbol.includes(q)) {
    score = Math.max(score, 62);
  }

  if (nameKo === q) {
    score = Math.max(score, 95);
  } else if (nameKo.startsWith(q)) {
    score = Math.max(score, 78);
  } else if (nameKo.includes(q)) {
    score = Math.max(score, 56);
  }

  if (nameEn.toLowerCase() === q) {
    score = Math.max(score, 90);
  } else if (nameEn.toLowerCase().startsWith(q)) {
    score = Math.max(score, 72);
  } else if (nameEn.toLowerCase().includes(q)) {
    score = Math.max(score, 52);
  }

  for (const tag of stock.tags) {
    const t = tag.toLowerCase();
    if (t === q) {
      score = Math.max(score, 88);
    } else if (t.startsWith(q)) {
      score = Math.max(score, 68);
    } else if (t.includes(q)) {
      score = Math.max(score, 46);
    }
  }

  return score;
}

export function searchStocks(query: string, limit = 10): Stock[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  return STOCKS.map((stock) => ({ stock, score: scoreStock(stock, trimmed) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ stock }) => stock);
}