import json,os,sys
R='.docstar-audit-bulk-results.jsonl'
d=json.load(open('.docstar-param-reapply-v2.mcp.json'))
done=set(d['updatedIds'])
if os.path.exists(R):
    for l in open(R):
        l=l.strip()
        if l:
            r=json.loads(l)
            if r['ok']: done.add(r['endpointId'])
if sys.argv[1]=='rec':
    # rec ok|fail id1 id2 ...
    ok=sys.argv[2]=='ok'
    with open(R,'a') as f:
        for i in sys.argv[3:]: f.write(json.dumps({'endpointId':i,'ok':ok})+'\n')
    for i in sys.argv[3:]:
        if ok: done.add(i)
ids=sorted(f[:-5] for f in os.listdir('.docstar-param-mcp-out') if f.endswith('.json') and len(f)==17)
rem=[i for i in ids if i not in done]
n=int(sys.argv[1]) if sys.argv[1].isdigit() else 25
ok=sum(1 for l in open(R) if json.loads(l)['ok']) if os.path.exists(R) else 0
print('REMAINING',len(rem),'okLog',ok,file=sys.stderr)
budget=16000
for i in rem[::-1][:n]:
    a=json.load(open('.docstar-param-mcp-out/'+i+'.json'))
    a.pop('bodyDescription',None)
    s=json.dumps(a,separators=(',',':'))
    budget-=len(s)
    if budget<0: break
    print(s)
