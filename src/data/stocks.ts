export type Stock = {
  symbol: string;
  nameKo: string;
  nameEn: string;
  market: "US" | "KS" | "KQ";
  tags: string[];
};

export const STOCKS: Stock[] = [
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
  { symbol: "041510", nameKo: "SM엔터테인먼트",      nameEn: "SM Entertainment",         market: "KS", tags: ["엔터", "아이돌", "SM", "k팝"] },
  { symbol: "035900", nameKo: "JYP Ent.",            nameEn: "JYP Entertainment",        market: "KS", tags: ["엔터", "트와이스", "JYP", "k팝"] },
  { symbol: "122870", nameKo: "와이지엔터테인먼트", nameEn: "YG Entertainment",         market: "KS", tags: ["엔터", "블랙핑크", "YG", "k팝"] },
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

  // ── 한국 주식(KOSDAQ / KQ) ────────────────────────────────────
  { symbol: "086520", nameKo: "에코프로",            nameEn: "EcoPro",                   market: "KQ", tags: ["2차전지", "배터리소재", "에코", "지주"] },
  { symbol: "247540", nameKo: "에코프로비엠",        nameEn: "EcoPro BM",                market: "KQ", tags: ["2차전지", "양극재", "배터리소재", "에코"] },
  { symbol: "293490", nameKo: "카카오게임즈",        nameEn: "Kakao Games",              market: "KQ", tags: ["게임", "카카오", "모바일게임"] },
  { symbol: "357780", nameKo: "솔브레인",            nameEn: "Soulbrain",                market: "KQ", tags: ["반도체소재", "화학"] },
  { symbol: "086900", nameKo: "메디톡스",            nameEn: "Medytox",                  market: "KQ", tags: ["바이오", "보톡스", "미용"] },
  { symbol: "145020", nameKo: "휴젤",                nameEn: "Hugel",                    market: "KQ", tags: ["바이오", "보톡스", "필러", "미용"] },
  { symbol: "403870", nameKo: "HPSP",                nameEn: "HPSP",                     market: "KQ", tags: ["반도체장비", "HPM"] },
  { symbol: "096040", nameKo: "두산퓨얼셀",          nameEn: "Doosan Fuel Cell",         market: "KQ", tags: ["수소", "연료전지", "신재생에너지"] },
];

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
