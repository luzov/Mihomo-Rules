const proxyName = "代理模式";

function main(params) {
	if (!params.proxies) return params;
	overwriteRules(params);
	overwriteProxyGroups(params);
	overwriteDns(params);
	return params;
}

const countryRegions = [
	{ code: "HK", name: "香港", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/hk.svg", regex: /(香港|HK|Hong Kong|🇭🇰)(?!.*(中国|CN|China|PRC|🇨🇳))/i },
	{ code: "TW", name: "台湾", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/tw.svg", regex: /(台湾|台灣|TW|Taiwan|🇹🇼)(?!.*(中国|CN|China|PRC|🇨🇳))(?!.*Networks)/i },  
	{ code: "SG", name: "新加坡", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/sg.svg", regex: /(新加坡|狮城|SG|Singapore|🇸🇬)/i },
	{ code: "JP", name: "日本", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/jp.svg", regex: /(日本|JP|Japan|东京|🇯🇵)/i },
	{ code: "US", name: "美国", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/us.svg", regex: /^(?!.*(Plus|plus|custom)).*(美国|美國|洛杉矶|US|USA|United States|America|🇺🇸)/i },
	{ code: "DE", name: "德国", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/de.svg", regex: /^(?!.*shadowsocks).*(德国|DE|Germany|🇩🇪)/i },
	{ code: "KR", name: "韩国", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/kr.svg", regex: /(韩国|韓國|首尔|KR|Korea|South Korea|🇰🇷)/i },
	{ code: "UK", name: "英国", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/gb.svg", regex: /(英国|UK|United Kingdom|Britain|Great Britain|🇬🇧)/i },
	{ code: "CA", name: "加拿大", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ca.svg", regex: /^(?!.*(Anycast|Datacamp)).*(加拿大|CA|Canada|🇨🇦)/i },
	{ code: "AU", name: "澳大利亚", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/au.svg", regex: /(澳大利亚|AU|Australia|🇦🇺)/i },
	{ code: "FR", name: "法国", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/fr.svg", regex: /^(?!.*(free|Frontier|Frankfurt)).*(法国|FR|France|🇫🇷)/i },
	{ code: "NL", name: "荷兰", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/nl.svg", regex: /^(?!.*(only|online|MNL)).*(荷兰|NL|Netherlands|🇳🇱)/i },
	{ code: "RU", name: "俄罗斯", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ru.svg", regex: /(俄罗斯|RU|Russia|🇷🇺)/i },
	{ code: "IN", name: "印度", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/in.svg", regex: /^(?!.*(Singapore|Argentina|Intel|Inc|ing|link|business|hinet|internet|印度尼西亚|main)).*(印度|IN|India|🇮🇳)/i }, 
	{ code: "BR", name: "巴西", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/br.svg", regex: /(巴西|BR|Brazil|🇧🇷)/i },
	{ code: "CN", name: "中国", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/cn.svg", regex: /^(?!.*(台湾|香港|TW|CN_d)).*(中国|CN|China|PRC|🇨🇳)/i },
	{ code: "MY", name: "马来西亚", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/my.svg", regex: /^(?!.*(myshadow)).*(马来西亚|MY|Malaysia|🇲🇾)/i },
	{ code: "VN", name: "越南", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/vn.svg", regex: /(越南|VN|Vietnam|🇻🇳)/i },
	{ code: "PH", name: "菲律宾", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ph.svg", regex: /^(?!.*(phoenix|phx)).*(菲律宾|菲律賓|PH|Philippines|🇵🇭)/i },
	{ code: "TH", name: "泰国", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/th.svg", regex: /^(?!.*(GTHost|pathx)).*(泰国|TH|Thailand|🇹🇭)/i },
	{ code: "ID", name: "印度尼西亚", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/id.svg", regex: /(印度尼西亚|ID|Indonesia|🇮🇩)/i },
	{ code: "AR", name: "阿根廷", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ar.svg", regex: /^(?!.*(warp|arm|flare|star|shar|par|akihabara|bavaria)).*(阿根廷|AR|Argentina|🇦🇷)/i },
	{ code: "NG", name: "尼日利亚", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ng.svg", regex: /^(?!.*(ong|ing|angeles|ang|ung)).*(尼日利亚|NG|Nigeria|🇳🇬)(?!.*(Hongkong|Singapore))/i },
	{ code: "TR", name: "土耳其", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/tr.svg", regex: /^(?!.*(trojan|str|central)).*(土耳其|TR|Turkey|🇹🇷)/i },
	{ code: "ES", name: "西班牙", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/es.svg", regex: /^(?!.*(vless|angeles|vmess|seychelles|business|ies|reston)).*(西班牙|ES|Spain|🇪🇸)/i },
	{ code: "PL", name: "波兰", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/pl.svg", regex: /(波兰|PL|Poland|🇵🇱)/i },
	{ code: "IR", name: "伊朗", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ir.svg", regex: /(伊朗|IR|Iran|🇮🇷)/i },
	{ code: "MO", name: "澳门", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/mo.svg", regex: /^(?!.*(mojie)).*(澳门|MO|Macao|🇲🇴)/i },
];

function getTestUrlForGroup(groupName) {
	switch (groupName) {
	case "Shared Chat":
		return "https://shared.oaifree.com/";
	case "Steam":
		return "https://store.steampowered.com/";
	case "Telegram":
		return "https://web.telegram.org/";
	case "ChatGPT":
		return "https://chat.openai.com/";
	case "Claude":
		return "https://claude.ai/";
	case "Spotify":
		return "https://www.spotify.com/";
	case "Google":
		return "http://google.com/";
	case "Microsoft":
		return "http://msn.com/";
	case "Linux Do":
		return "https://linux.do/";
	default:
		return "http://www.gstatic.com/generate_204";
	}
}

function getIconForGroup(groupName) {
	switch (groupName) {
	case "Shared Chat":
		return "https://linux.do/user_avatar/linux.do/neo/144/12_2.png";
	case "Linux Do":
		return "https://linux.do/uploads/default/original/3X/9/d/9dd49731091ce8656e94433a26a3ef36062b3994.png";
	case "Steam":
		return "https://fastly.jsdelivr.net/gh/Orz-3/mini@master/Color/Steam.png";
	case "Telegram":
		return "https://fastly.jsdelivr.net/gh/shindgewongxj/WHATSINStash@master/icon/telegram.png";
	case "ChatGPT":
		return "https://fastly.jsdelivr.net/gh/shindgewongxj/WHATSINStash@master/icon/openai.png";
	case "Claude":
		return "https://fastly.jsdelivr.net/gh/shindgewongxj/WHATSINStash@master/icon/anthropic.png";
	case "Spotify":
		return "https://fastly.jsdelivr.net/gh/shindgewongxj/WHATSINStash@master/icon/spotify.png";
	case "Google":
		return "https://fastly.jsdelivr.net/gh/shindgewongxj/WHATSINStash@master/icon/google.png";
	case "Microsoft":
		return "https://fastly.jsdelivr.net/gh/shindgewongxj/WHATSINStash@master/icon/microsoft.png";
	case "漏网之鱼":
		return "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/fish.svg";
	case "广告拦截":
		return "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/block.svg";
	default:
		return "";
	}
}

const customRules = [
	"DOMAIN-SUFFIX,linux.do,Linux Do",
	"DOMAIN-SUFFIX,shared.oaifree.com,Shared Chat",
  "IP-CIDR,183.230.113.152/32,REJECT",
	"IP-CIDR,1.12.12.12/32,代理模式"
];

function overwriteRules(params) {
	const rules = [
		...customRules,
		"RULE-SET,steam,Steam",
		"RULE-SET,telegramcidr,Telegram,no-resolve",
		"RULE-SET,openai,ChatGPT",
		"RULE-SET,claude,Claude",
		"RULE-SET,spotify,Spotify",
		"RULE-SET,google,Google",
		"RULE-SET,Microsoft,Microsoft",
		"GEOIP,CN,DIRECT,no-resolve",
		"GEOIP,LAN,DIRECT,no-resolve",
		"GEOSITE,geolocation-cn,DIRECT",
		"RULE-SET,direct,DIRECT",
		"RULE-SET,cncidr,DIRECT",
		"RULE-SET,private,DIRECT",
		"RULE-SET,lancidr,DIRECT",
		"RULE-SET,applications,DIRECT",
		// "RULE-SET,apple," + proxyName,
		// "RULE-SET,icloud," + proxyName,
		// "RULE-SET,greatfire," + proxyName,
		"RULE-SET,reject,广告拦截",
		"RULE-SET,AD,广告拦截",
		"RULE-SET,EasyList,广告拦截",
		"RULE-SET,EasyListChina,广告拦截",
		"RULE-SET,EasyPrivacy,广告拦截",
		"RULE-SET,ProgramAD,广告拦截",
		// "RULE-SET,gfw," + proxyName,
		// "RULE-SET,proxy," + proxyName,
		// "RULE-SET,tld-not-cn," + proxyName,
		"MATCH,漏网之鱼",
	];
	const ruleProviders = {
		steam: {
			type: "http",
			behavior: "classical",
			url: "https://raw.githubusercontent.com/yangtb2024/Steam-Clash/refs/heads/main/Steam.txt",
			path: "./ruleset/steam.yaml",
			interval: 86400,
		},
		Microsoft: {
			type: "http",
			behavior: "classical",
			url: "https://raw.githubusercontent.com/yangtb2024/Steam-Clash/refs/heads/main/microsoft.txt",
			path: "./ruleset/Microsoft.yaml",
			interval: 86400,
		},
		reject: {
			type: "http",
			behavior: "domain",
			url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt",
			path: "./ruleset/reject.yaml",
			interval: 86400,
		},
		icloud: {
			type: "http",
			behavior: "domain",
			url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/icloud.txt",
			path: "./ruleset/icloud.yaml",
			interval: 86400,
		},
		apple: {
			type: "http",
			behavior: "domain",
			url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/apple.txt",
			path: "./ruleset/apple.yaml",
			interval: 86400,
		},
		google: {
			type: "http",
			behavior: "domain",
			url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/google.txt",
			path: "./ruleset/google.yaml",
			interval: 86400,
		},
		proxy: {
			type: "http",
			behavior: "domain",
			url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt",
			path: "./ruleset/proxy.yaml",
			interval: 86400,
		},
		openai: {
			type: "http",
			behavior: "classical",
			url: "https://fastly.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/OpenAI/OpenAI.yaml",
			path: "./ruleset/custom/openai.yaml",
			interval: 86400,
		},
		claude: {
			type: "http",
			behavior: "classical",
			url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Claude/Claude.yaml",
			path: "./ruleset/custom/Claude.yaml",
			interval: 86400,
		},
		spotify: {
			type: "http",
			behavior: "classical",
			url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Spotify/Spotify.yaml",
			path: "./ruleset/custom/Spotify.yaml",
			interval: 86400,
		},
		telegramcidr: {
			type: "http",
			behavior: "ipcidr",
			url: "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/telegramcidr.txt",
			path: "./ruleset/custom/telegramcidr.yaml",
			interval: 86400,
		},
		direct: {
			type: "http",
			behavior: "domain",
			url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt",
			path: "./ruleset/direct.yaml",
			interval: 86400,
		},
		private: {
			type: "http",
			behavior: "domain",
			url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/private.txt",
			path: "./ruleset/private.yaml",
			interval: 86400,
		},
		gfw: {
			type: "http",
			behavior: "domain",
			url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/gfw.txt",
			path: "./ruleset/gfw.yaml",
			interval: 86400,
		},
		greatfire: {
			type: "http",
			behavior: "domain",
			url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/greatfire.txt",
			path: "./ruleset/greatfire.yaml",
			interval: 86400,
		},
		"tld-not-cn": {
			type: "http",
			behavior: "domain",
			url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/tld-not-cn.txt",
			path: "./ruleset/tld-not-cn.yaml",
			interval: 86400,
		},
		cncidr: {
			type: "http",
			behavior: "ipcidr",
			url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/cncidr.txt",
			path: "./ruleset/cncidr.yaml",
			interval: 86400,
		},
		lancidr: {
			type: "http",
			behavior: "ipcidr",
			url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/lancidr.txt",
			path: "./ruleset/lancidr.yaml",
			interval: 86400,
		},
		applications: {
			type: "http",
			behavior: "classical",
			url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/applications.txt",
			path: "./ruleset/applications.yaml",
			interval: 86400,
		},
		AD: {
		  type: "http",
		  behavior: "domain",
		  url: "https://raw.githubusercontent.com/earoftoast/clash-rules/main/AD.yaml",
		  path: "./rules/AD.yaml",
		  interval: 86400,
		},
		EasyList: {
		  type: "http",
		  behavior: "domain",
		  url: "https://raw.githubusercontent.com/earoftoast/clash-rules/main/EasyList.yaml",
		  path: "./rules/EasyList.yaml",
		  interval: 86400,
		},
		EasyListChina: {
		  type: "http",
		  behavior: "domain",
		  url: "https://raw.githubusercontent.com/earoftoast/clash-rules/main/EasyListChina.yaml",
		  path: "./rules/EasyListChina.yaml",
		  interval: 86400,
		},
		EasyPrivacy: {
		  type: "http",
		  behavior: "domain",
		  url: "https://raw.githubusercontent.com/earoftoast/clash-rules/main/EasyPrivacy.yaml",
		  path: "./rules/EasyPrivacy.yaml",
		  interval: 86400,
		},
		ProgramAD: {
		  type: "http",
		  behavior: "domain",
		  url: "https://raw.githubusercontent.com/earoftoast/clash-rules/main/ProgramAD.yaml",
		  path: "./rules/ProgramAD.yaml",
		  interval: 86400,
		},
		gfw: {
		  type: "http",
		  behavior: "domain",
		  url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/gfw.txt",
		  path: "./ruleset/gfw.yaml",
		  interval: 86400,
		},
		greatfire: {
		  type: "http",
		  behavior: "domain",
		  url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/greatfire.txt",
		  path: "./ruleset/greatfire.yaml",
		  interval: 86400,
		},
	};
	
	params["rule-providers"] = ruleProviders;
	params["rules"] = rules;
}

function overwriteProxyGroups(params) {
  const allProxies = params["proxies"].map((e) => e.name);

  const availableCountryCodes = new Set();
  const otherProxies = [];
  for (const proxy of params["proxies"]) {
    let bestMatch = null;
    let longestMatchLength = 0;

    for (const region of countryRegions) {
      const match = proxy.name.match(region.regex);
      if (match) {
        if (match[0].length > longestMatchLength) {
          longestMatchLength = match[0].length;
          bestMatch = region.code;
        }
      }
    }

    if (bestMatch) {
      availableCountryCodes.add(bestMatch);
    } else {
      otherProxies.push(proxy.name);
    }
  }

  availableCountryCodes.add("CN");

  const autoProxyGroupRegexs = countryRegions
    .filter(region => availableCountryCodes.has(region.code))
    .map(region => ({
      name: `${region.code} - 自动选择`,
      regex: region.regex,
    }));

  const autoProxyGroups = autoProxyGroupRegexs
    .map((item) => ({
      name: item.name,
      type: "url-test",
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      tolerance: 50,
      proxies: getProxiesByRegex(params, item.regex),
      hidden: true,
    }))
    .filter((item) => item.proxies.length > 0);

  const manualProxyGroupsConfig = countryRegions
    .filter(region => availableCountryCodes.has(region.code))
    .map(region => ({
      name: `${region.code} - 手动选择`,
      type: "select",
      proxies: getManualProxiesByRegex(params, region.regex),
      icon: region.icon,
      hidden: false,
    })).filter(item => item.proxies.length > 0);

  let otherManualProxyGroup = null;
  let otherAutoProxyGroup = null;

  if (otherProxies.length > 0) {
    otherManualProxyGroup = {
      name: "其它 - 手动选择",
      type: "select",
      proxies: otherProxies,
      icon: "https://www.clashverge.dev/assets/icons/guard.svg",
      hidden: false,
    };

    otherAutoProxyGroup = {
      name: "其它 - 自动选择",
      type: "url-test",
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      tolerance: 50,
      proxies: otherProxies,
      hidden: true,
    };
  }

  const groups = [
    {
      name: proxyName,
      type: "select",
      url: "http://www.gstatic.com/generate_204",
      icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/adjust.svg",
      proxies: ["自动选择", "手动选择", "负载均衡 (散列)", "负载均衡 (轮询)", "DIRECT"],
    },

    {
      name: "手动选择",
      type: "select",
      icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/link.svg",
      proxies: allProxies.length > 0 ? allProxies : ["DIRECT"],
    },

    {
      name: "自动选择",
      type: "select",
      icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/speed.svg",
      proxies: ["ALL - 自动选择", ...autoProxyGroups
        .filter(group => !["Shared Chat", "Steam", "Telegram", "ChatGPT", "Claude", "Spotify", "Google", "Microsoft", "Linux Do"].includes(group.name))
        .map(group => group.name), otherAutoProxyGroup ? otherAutoProxyGroup.name : null].filter(Boolean),
    },

    {
      name: "负载均衡 (散列)",
      type: "load-balance",
      url: "http://www.gstatic.com/generate_204",
      icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/balance.svg",
      interval: 300,
      "max-failed-times": 3,
      strategy: "consistent-hashing",
      lazy: true,
      proxies: allProxies.length > 0 ? allProxies : ["DIRECT"],
      hidden: true,
    },

    {
      name: "负载均衡 (轮询)",
      type: "load-balance",
      url: "http://www.gstatic.com/generate_204",
      icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/merry_go.svg",
      interval: 300,
      "max-failed-times": 3,
      strategy: "round-robin",
      lazy: true,
      proxies: allProxies.length > 0 ? allProxies : ["DIRECT"],
      hidden: true,
    },

    {
      name: "ALL - 自动选择",
      type: "url-test",
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      tolerance: 50,
      proxies: allProxies.length > 0 ? allProxies : ["DIRECT"],
      hidden: true,
    },

    {
      name: "Shared Chat",
      type: "select",
      url: getTestUrlForGroup("Shared Chat"),
      icon: getIconForGroup("Shared Chat"),
      proxies: [
        "DIRECT",
        proxyName,
        "ALL - 自动选择", 
        ...countryRegions
          .filter(region => availableCountryCodes.has(region.code))
          .flatMap(region => [
            `${region.code} - 自动选择`,
            `${region.code} - 手动选择`,
          ]),
        otherAutoProxyGroup ? `${otherAutoProxyGroup.name}` : null,
      ].filter(Boolean),
    },

    ...["Steam", "Telegram", "ChatGPT", "Claude", "Spotify", "Google", "Microsoft", "Linux Do"].map(groupName => ({
      name: groupName,
      type: "select",
      url: getTestUrlForGroup(groupName),
      icon: getIconForGroup(groupName),
      proxies: [
        proxyName,
        "DIRECT",
        `ALL - 自动选择`, 
        ...countryRegions
          .filter(region => availableCountryCodes.has(region.code))
          .flatMap(region => [
            `${region.code} - 自动选择`, 
            `${region.code} - 手动选择`,
          ]),
        otherAutoProxyGroup ? `${otherAutoProxyGroup.name}` : null,
      ].filter(Boolean),
    })),

    {
      name: "漏网之鱼",
      type: "select",
      proxies: [proxyName, "DIRECT"],
      icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/fish.svg",
      hidden: true,
    },

    {
      name: "广告拦截",
      type: "select",
      proxies: ["REJECT", "DIRECT", proxyName],
      icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/block.svg",
      hidden: true,
    },
  ];

  if (otherAutoProxyGroup) {
    autoProxyGroups.push(otherAutoProxyGroup);
  }

  groups.push(...autoProxyGroups);
  groups.push(...manualProxyGroupsConfig);
  if (otherManualProxyGroup) {
    groups.push(otherManualProxyGroup);
  }
  params["proxy-groups"] = groups;
}

function overwriteDns(params, proxyName) {
  const cnDnsList = [
    "https://223.5.5.5/dns-query",
    "https://1.12.12.12/dns-query",
  ];
  const trustDnsList = [
    "quic://dns.cooluc.com",
    "https://1.0.0.1/dns-query",
    "https://1.1.1.1/dns-query",
    "https://cloudflare-dns.com/dns-query",
  ];

  const dnsOptions = {
    enable: true,
    "prefer-h3": true,
    "default-nameserver": cnDnsList,
    nameserver: trustDnsList,
    "nameserver-policy": {
      "geosite:cn": cnDnsList,
      "geoip:cn": cnDnsList,
      "DOMAIN-SUFFIX,shared.oaifree.com": cnDnsList,
      "geosite:geolocation-!cn": trustDnsList,
      "domain:google.com,facebook.com,youtube.com,twitter.com,github.com,cloudflare.com,jsdelivr.net,hf.space":
        trustDnsList,
    },
    fallback: [],
    "fallback-filter": {
      "response-code": "REFUSED,SERVFAIL,NXDOMAIN",
    },
    "enhanced-mode": "redir-host-with-ipv6",
    "fake-ip-range": "198.18.0.0/16",
    "system-dns": [],
    "use-hosts": true,
    "listen": "0.0.0.0:5353",

    "query-strategy": "USE_PROXY",
    cache: {
      enable: true,
      size: 4096,
      expire: 3600,
    },
  };

  const githubPrefix = "https://fastgh.lainbo.com/";
  const rawGeoxURLs = {
    geoip:
      "https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geoip-lite.dat",
    geosite:
      "https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geosite.dat",
    mmdb:
      "https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/country-lite.mmdb",
  };
  const accelURLs = Object.fromEntries(
    Object.entries(rawGeoxURLs).map(([key, githubUrl]) => [
      key,
      `${githubPrefix}${githubUrl}`,
    ])
  );

  const otherOptions = {
    "unified-delay": false,
    "tcp-concurrent": true,
    profile: { "store-selected": true, "store-fake-ip": true },
    sniffer: {
      enable: true,
      sniff: {
        TLS: { ports: [443, 8443] },
        HTTP: { ports: [80, "8080-8880"], "override-destination": true },
      },
    },
    "geodata-mode": true,
    "geox-url": accelURLs,
    "fake-ip-filter": ["geoip:cn"],
  };

  params.dns = { ...params.dns, ...dnsOptions };
  Object.keys(otherOptions).forEach((key) => {
    params[key] = otherOptions[key];
  });

  params.rules = params.rules || [];
  params.rules.unshift("DOMAIN-KEYWORD,dns,代理模式");
}	

function getProxiesByRegex(params, regex) {
	const matchedProxies = params.proxies.filter((e) => regex.test(e.name)).map((e) => e.name);
	return matchedProxies.length > 0 ? matchedProxies : ["手动选择"];
}

function getManualProxiesByRegex(params, regex) {
	const matchedProxies = params.proxies.filter((e) => regex.test(e.name)).map((e) => e.name);
	return regex.test("CN") 
	? ["DIRECT", ...matchedProxies]
	: matchedProxies.length > 0 
	? matchedProxies 
	: ["DIRECT", "手动选择", proxyName];
}
