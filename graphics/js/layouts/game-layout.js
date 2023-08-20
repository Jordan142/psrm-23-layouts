'use strict';

$(() => {

	loadFromSpeedControl();

	function loadFromSpeedControl() {
		const speedcontrolBundle = 'nodecg-speedcontrol';

		let gameTitle = $('#game-name');
		let gameCategory = $('#category');
		let gameSystem = $('#platform');
		let gameYear = $('#year');
		let gameEstimate = $('#estimate');

		let runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
		runDataActiveRun.on('change', (newVal, oldVal) => {
			if (newVal)
				updateSceneFields(newVal);
		});

		function updateSceneFields(runData) {
			let currentTeamsData = runData.teams;
			gameSystem.html(runData.system);
			gameYear.html(runData.release);
			gameEstimate.html(runData.estimate);
			let customData = runData.customData;

			fadeHtml('#game-name', runData.game.toUpperCase(), true);
			fadeHtml('#category', runData.category, true);

			$('.runner-name').add('.pronouns').text('');
			$('.runner-details').data('teamID', '');
			$('.game-img').data('game-img','');
			let i = 0;

			for (let team of currentTeamsData) {
				for (let player of team.players) {
					fadeText('#runner-name' + (i + 1), player.name, true);
					let pronoun = '[' + player.pronouns + ']';
					if (pronoun === '[undefined]')
						pronoun = '';
					fadeText('#pronouns' + (i + 1), pronoun, true);

					$('#runner-details' + (i + 1)).data('teamID', player.teamID);

					// Grabs either Pika_Head or Eevee_Head image from common file and attributes it to the source
					$('#game' + (i + 1) + '-img').data('game-img', 'img/common/' + player.customData.runnerGame + '_Head.png');
					var imgSrc = $('#game' + (i + 1) + '-img').data('game-img');
					$('#game' + (i + 1) + '-img').attr('src', imgSrc);
					i += 1;
				}
			}

			$('.comms-name').add('.comms-pronouns').text('');
			$('.raceTime').text('');
			Object.entries(customData).map(([key, val] = entry) => {
				if(key.includes("Pronouns")) {
					val = '[' + val + ']'
				}
				fadeText('#' + key, val, true);
			});
		}
	}
});