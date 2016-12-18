#!/bin/bash

if [[ $# -eq 0 ]] ; then
	echo 'Need arguments'
	exit 0
fi

echo "Getting from $1, putting into $2"

mkdir -p testFiles/static/$2

for FILE in ArtifactInfo.csv \
			EquipmentInfo.csv \
			HelperImprovementsInfo.csv \
			HelperInfo.csv \
			HelperSkillInfo.csv \
			PetInfo.csv \
			PlayerImprovementsInfo.csv \
			SkillTreeInfo.csv
do
	wget -q https://s3.amazonaws.com/tt2-static/info_files/$1/$FILE -O testFiles/static/$2/$FILE
done

echo "Done"