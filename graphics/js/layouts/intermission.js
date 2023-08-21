const ON_DECK_IMGS = [
	'img/common/calendar.png',
	'img/common/twitch-logo.webp',
	'img/common/medal_none.png'
];

let runDataActiveRun = nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol');
let runDataArray = nodecg.Replicant('runDataArray', 'nodecg-speedcontrol');

NodeCG.waitForReplicants(runDataActiveRun, runDataArray).then(loadFromSpeedControl);

function getNextRuns(runData, amount) {
	let nextRuns = [];
	let indexOfCurrentRun = findIndexInRunDataArray(runData);
	for (let i = 1; i <= amount; i++) {
		if (!runDataArray.value[indexOfCurrentRun + i]) {
			break;
		}
		nextRuns.push(runDataArray.value[indexOfCurrentRun + i]);
	}
	return nextRuns;
}

function findIndexInRunDataArray(run) {
	let indexOfRun = -1;
	if (run) {
		for (let i = 0; i < runDataArray.value.length; i++) {
			if (run.id === runDataArray.value[i].id) {
				indexOfRun = i; break;
			}
		}
	}
	return indexOfRun;
}

function loadFromSpeedControl() {
	runDataActiveRun.on('change', (newVal, oldVal) => {
		refreshNextRunsData(newVal);
	});

	runDataArray.on('change', (newVal, oldVal) => {
		refreshNextRunsData(runDataActiveRun.value);
	});

}

function refreshNextRunsData(currentRun) {
	let nextRuns = getNextRuns(currentRun, 3);

	let upNextGame = '#up-next-game';
	let upNextInfo = '#up-next-info';
	let upNextEstimate = '#up-next-estimate';
	fadeHtml(upNextGame, currentRun.game, true);
	fadeHtml(upNextInfo, getNamesForRun(runDataActiveRun.value).join(' vs. '), true);
	fadeHtml(upNextEstimate, currentRun.estimate, true);
	// if (nodecg.bundleConfig.customData.useCustomHost && currentRun.customData.host !== undefined)		commented out due to not having a host set up
	// 	fadeHtml('#host', "Host: " + currentRun.customData.host);											which causes the whole block of code to error
	// else
	// 	fadeHtml('#host', '');

	let i = 0;
	for (let run of nextRuns) {
		if (i >= 3) {
			break;
		}
		let onDeckGame = '#on-deck-game' + (i + 1);
		let onDeckRunner = '#on-deck-info' + (i + 1);
		let onDeckEstimate = '#on-deck-estimate' + (i + 1); // Commented out as I don't need the estimate for the Lets Go tournament
		let onDeckStart = '#on-deck-start' + (i + 1);
		let onDeckChannel = '#on-deck-channel' + (i + 1);
		fadeHtml(onDeckGame, run.game, true);
		fadeHtml(onDeckRunner, getNamesForRun(run).join(' vs. '), true); // Change .vs to , once tournament is done
		fadeHtml(onDeckEstimate, run.estimate, true); // Commented out as I don't need the estimate for the Lets Go tournament
		if (run.customData.raceTime == undefined) {
			fadeHtml(onDeckStart, 'TBC', true);
		} else {
			fadeHtml(onDeckStart, run.customData.raceTime + ' ET', true);
		}
		if (run.customData.channel == undefined) {
			fadeHtml(onDeckChannel, 'TBC', true);
		} else {
			fadeHtml(onDeckChannel, run.customData.channel, true);
		}
		// $('#calendar' + (i + 1)).attr('src', ON_DECK_IMGS[0]);
		// $('#twitch-logo' + (i + 1)).attr('src', ON_DECK_IMGS[1]);
		i += 1;
	}
}