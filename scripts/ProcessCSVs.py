import re

outputFile = open('output.txt', 'w')

def writeLineToFile(s):
	outputFile.write(s)
	outputFile.write('\n')

def getPercent(s):
	return int(float(s) * 100)

writeLineToFile('  --  ArtifactInfo.js')
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
		adpl = getPercent(s[5])
		bType = 'BonusType.' + s[3]
		bAmount = float(s[4]) * 100
		alls.append('  {:>2}: new Artifact( {:>2}, {:24}, {:4.2f}, {:3.1f}, {:2d}, {{[BonusType.ArtifactDamage]: {:3d}, [{:35}]: {:5.1f}}}),'.format(aid, aid, name, costc, coste, maxLevel, adpl, bType, bAmount))
	alls.sort()
	for s in alls:
		writeLineToFile(s)
print 'Done with ArtifactInfo'

writeLineToFile('  --  HelperImprovementsInfo.js')
with open('HelperImprovementsInfo.csv', 'r') as f:
	f.readline()
	for line in f:
		s = line.strip().split(',')
		level = int(s[0])
		multiplier = float(s[1])
		writeLineToFile('  {:4d}: {:5.1f},'.format(level, multiplier))

print 'Done with HelperImprovementsInfo'

writeLineToFile('  --  PlayerImprovementsInfo.js')
with open('PlayerImprovementsInfo.csv', 'r') as f:
	f.readline()
	for line in f:
		s = line.strip().split(',')
		level = int(s[0])
		multiplier = float(s[1])
		writeLineToFile('  {:4d}: {:5.1f},'.format(level, multiplier))

print 'Done with PlayerImprovementsInfo'

heroIdToId = {}
writeLineToFile('  --  Hero.js')
with open('HelperInfo.csv', 'r') as f:
	f.readline()
	alls = []
	for line in f:
		s = line.strip().split(',')
		hid = s[0]
		unlockOrder = int(s[1])

		heroIdToId[hid] = unlockOrder

		htype = 'BonusType.' + s[2] + 'HelperDamage'
		cost = float(s[3])
		extra = ' ' if len('{:.4e}'.format(cost).split('e')[1]) < 4 else ''
		alls.append('  {:>2}: new Hero( {:>2}, "{:3}", {:29}, {:.4e}{}),'.format(unlockOrder, unlockOrder, hid, htype, cost, extra))
	alls.sort()
	for s in alls:
		writeLineToFile(s)
print 'Done with HeroInfo'

writeLineToFile('  --  Hero.js')
with open('HelperSkillInfo.csv', 'r') as f:
	f.readline()
	alls = []
	for line in f:
		s = line.strip().split(',')
		hid = heroIdToId[s[1]]
		btype = 'BonusType.' + s[3]
		magnitude = float(s[4])
		level = int(s[5])
		alls.append('HeroInfo[{:>2}].addSkill( {:>4}, {:31}, {:5.3f});'.format(hid, level, btype, magnitude))
	alls.sort()
	for s in alls:
		writeLineToFile(s)
print 'Done with HeroSkills'

writeLineToFile('  --  Pet.js')
with open('PetInfo.csv', 'r') as f:
	f.readline()
	alls = []
	for line in f:
		s = line.strip().split(',')
		pid = int(s[0][3:])
		pids = s[0]

		damageBase = getPercent(s[1])
		inc1 = getPercent(s[2])
		inc2 = getPercent(s[3])
		inc3 = getPercent(s[4])
		bonusType = 'BonusType.' + s[5]
		bonusBase = float(s[6])
		bonusInc = float(s[7])

		alls.append('  {:>2}: new Pet( {:>2}, {:5}, {:3}, {:>3}, {:>3}, {:>3}, {:29}, {:4.2f}, {:5.3f}),'.format(pid, pid, pids, damageBase, inc1, inc2, inc3, bonusType, bonusBase, bonusInc))
	alls.sort()
	for s in alls:
		writeLineToFile(s)
print 'Done with PetInfo'


outputFile.close()