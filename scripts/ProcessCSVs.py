import re

with open('ArtifactInfo.csv', 'r') as f:
	f.readline()
	alls = []
	for line in f:
		s = re.sub(r'"([\w\s]+),([\w\s]+)"', r'\1:\2', line).strip().split(',')
		aid = s[0][8:]
		name = '"' + s[9] + '"'
		costc = float(s[6])
		coste = float(s[7])
		maxLevel = int(s[1])
		adpl = int(float(s[5]) * 100)
		bType = 'BonusType.' + s[3]
		bAmount = float(s[4]) * 100
		alls.append('  {:>2}: new Artifact({:>2}, {:24}, {:4.2f}, {:3.1f}, {:2d}, {{[BonusType.ArtifactDamage]: {:3d}, [{:35}]: {:5.1f}}}),'.format(aid, aid, name, costc, coste, maxLevel, adpl, bType, bAmount))
	alls.sort()
	for s in alls:
		print s

print "\n\n"

with open('HelperImprovementsInfo.csv', 'r') as f:
	f.readline()
	for line in f:
		s = line.strip().split(',')
		level = int(s[0])
		multiplier = float(s[1])
		print '  {:4d}: {:5.1f},'.format(level, multiplier)