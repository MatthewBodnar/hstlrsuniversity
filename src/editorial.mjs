// The reading voice is retained; profanity gets a star on its first vowel.
export const swearPattern = /\b(?:motherfuck(?:er|ers|ing)?|fuck(?:s|ed|ing|er|ers|up|ups|wit|wits)?|bullshit(?:s|ting)?|shit(?:s|ty|ting|ted|head|heads)?|asshole(?:s)?|arsehole(?:s)?|bitch(?:es|y|ing)?|bastard(?:s)?|cunt(?:s)?|dick(?:s|head|heads)?|piss(?:ed|ing|es)?|cock(?:s|sucker|suckers)?|prick(?:s)?|wank(?:er|ers|ing)?|twat(?:s)?|damn(?:ed)?|hell|arse|ass|bollocks|crap(?:py)?|puss(?:y|ies)|badass(?:es)?|dumbass(?:es)?|jackass(?:es|[0-9]+)?|smartass(?:es)?)\b/gi;
export const maskWords = value => String(value ?? '').replace(swearPattern, word => word.replace(/[aeiou]/i,'*'));
export const maskHTML = html => String(html).split(/(<[^>]*>)/g).map(part => part.startsWith('<') ? part : maskWords(part)).join('');
export const escapeText = value => maskWords(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export const plainText = value => String(value ?? '').replace(/<!--[^]*?-->/g,' ').replace(/<[^>]*>/g,' ').replace(/&(?:amp|lt|gt|quot|apos|nbsp);/g,' ').replace(/\s+/g,' ').trim();
export const countWords = value => plainText(value).split(/\s+/).filter(Boolean).length;
