# education.json:
## education:
```
{
    "id": <現有最大id+1>,
    "institution": "<學校名稱>",
    "degree": "<科系名/學歷>",
    "period": "<在讀時間>",
    "description": "<介紹>"
}
```
## certificates:
```
{
    "id": <現有最大id+1>,
    "name": "<證照名稱>",
    "issuer": "<給發單位>",
    "date": "<年份>",
    "credentialLink": "<連結>"
}
```
# experiences.json:
```
{
    "id": <現有最大id+1>,
    "role": "<身份>",
    "company": "<單位名稱>",
    "period": "<任職期間>",
    "description": "<工作介紹>",
    "achievements": ["<貢獻/自我提升/成就1>", "<貢獻/自我提升/成就2>", "<貢獻/自我提升/成就3>"]
}
```
# project.json:
```
{
    "id": <現有最大id+1>,
    "title": "個人作品集與部落格",
    "description": "使用 Next.js 和 TailwindCSS 開發的個人網站，整合了作品集展示和技術部落格功能。採用 Flask 和 MongoDB 構建的後端 API，支持博客內容管理和用戶互動。",
    "link": "https://graycat.me",
    "technologies": ["Next.js(TSX)", "TailWindCSS", "Py-Flask", "MongoDB"]
}
```