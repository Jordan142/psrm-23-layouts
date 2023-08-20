'use strict';

const speedcontrolBundle = 'nodecg-speedcontrol';

const MEDAL_IMGS = [
	'img/common/medal_gold.png',
	'img/common/medal_silver.png',
	'img/common/medal_bronze.png',
	'img/common/medal_none.png'
];

const POKEBALL_IMGS = [
	'img/common/Master_Ball_Sprite.png',
	'img/common/Ultra_Ball_Sprite.png',
	'img/common/Great_Ball_Sprite.png',
	'img/common/Poke_Ball_Sprite.png',
	'img/common/medal_none.png'
];

let runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
let timer = nodecg.Replicant('timer', speedcontrolBundle);

let i = 0;
let runData;
let completedID = [];
let forfeitID = [];
$(() => {
	loadFromSpeedControl();

	function loadFromSpeedControl() {
		runDataActiveRun.on('change', (newVal, oldVal) => {
			if (newVal) {
				runData = newVal;
				resetMedals();
			}
		});
	}

	function resetMedals() {
		for (let k = 1; k < 6; k++) {
			$('#finalTime' + k).text('');
			$('#medals' + (k) + '-img').attr('src', POKEBALL_IMGS[4]);
		}
		completedID = [];
		forfeitID = [];
		trackTimer();
	}

	function trackTimer() {
		i = 0;
		let timer = nodecg.Replicant('timer', speedcontrolBundle);
		timer.on('change', (newVal, oldVal) => {
			for (let team of runData.teams) {
				try {
					if (runData.teams.length > 1 && newVal.teamFinishTimes[team.id].state === 'completed' && !completedID.includes(team.id)) {
						completedID.push(team.id);
						setMedal();
					}
					if (runData.teams.length > 1 && newVal.teamFinishTimes[team.id].state === 'forfeit' && !completedID.includes(team.id)) {
						forfeitID.push(team.id);
						setForfeit();
					}
					if (newVal.milliseconds < oldVal.milliseconds && newVal.milliseconds === 0)
						resetMedals();
				}
				catch {
					if (completedID.includes(team.id) || forfeitID.includes(team.id))
						removeMedal(team.id);
				}
			}
		});
	}

	function setMedal() {
		let n = 0;
		completedID.sort(function(a, b) {
			return timer.value.teamFinishTimes[a].milliseconds - timer.value.teamFinishTimes[b].milliseconds;
		})
		for (let i = 0; i < completedID.length; i++) {
			for (let k = 0; k < runData.teams.length; k++) {
				if (runData.teams[k].id === completedID[i]) {
					$('#finalTime' + (k + 1)).text(timer.value.teamFinishTimes[runData.teams[k].id].time);
					$('#medals' + (k + 1) + '-img').attr('src', POKEBALL_IMGS[n]);
					n++;
				}
			}
		}
	}

	function setForfeit() {
		let n = 0;
		for (let i = 0; i < forfeitID.length; i++) {
			for (let k = 0; k < runData.teams.length; k++) {
				if (runData.teams[k].id === forfeitID[i]) {
					$('#finalTime' + (k + 1)).text('Forfeit');
					$('#medals' + (k + 1) + '-img').attr('src', POKEBALL_IMGS[4]);
					n++;
				}
			}
		}
	}

	function removeMedal(id) {
		if (completedID.indexOf(id) > -1) {
			let n = completedID.indexOf(id);
			completedID.splice(n, 1);
			for (let k = 1; k < 5; k++) {
				$('#finalTime' + k).text('');
				$('#medals' + (k) + '-img').attr('src', POKEBALL_IMGS[4]);
			}
			setMedal(completedID[0]);
		}
		if (forfeitID.indexOf(id) > -1) {
			let n = forfeitID.indexOf(id);
			forfeitID.splice(n, 1);
			for (let k = 1; k < 5; k++) {
				$('#finalTime' + k).text('');
				$('#medals' + (k) + '-img').attr('src', POKEBALL_IMGS[4]);
			}
			setMedal(forfeitID[0]);
		}
	}
});