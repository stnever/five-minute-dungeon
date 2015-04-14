$(function() {
	$(document).on('tapstart', 'li.clickable', function() {
		if ( ! $(this).hasClass('black'))
			$(this).addClass('clicked');
	})

	$(document).on('tapmove', 'li', function() {
		$('.clicked').removeClass('clicked');
	})

	$(document).on('tapend', function() {
		$('.clicked').removeClass('clicked');
	})
})

var app = angular.module("FiveMinuteDungeon",[/*'velocity.ui', 'ngAnimate'*/]);

app.filter('prettyJson', function() {
	return function(obj) {
		return JSON.stringify(obj, null, ' ');
	}
})

app.directive('fmdGain', function() {
	return {
		restrict: 'E',
		template:
'<ul class="attributes"><li class="attr" ng-repeat="kv in kvs" ng-class="kv.key">' +
' {{plusIfNecessary(kv.value)}}' +
'</li></ul>',
		scope: {
			gain: '='
		},
		link: function(scope, elem, attrs) {
			scope.kvs = kvs(scope.gain);

			scope.plusIfNecessary = function(n) {
				if ( n >= 0 ) return '+' + n;
				return n;
			}
		}
	}
})

app.directive('fmdCost', function() {
	return {
		restrict: 'E',
		template:
'<div class="cost {{c.key}}" ng-repeat="c in costs" ng-class="{positive: c.value > 0}">' +
' {{plusIfNecessary(c.value)}}' +
'</div>' +
'<div class="cost free" ng-if="isFree()"></div>',
		scope: {
			cost: '='
		},
		link: function(scope, elem, attrs) {

			console.log('link', scope.cost);

			scope.costs = kvs(_.omit(scope.cost, function(v) {
				return v == 0 || v == null
			}));

			scope.plusIfNecessary = function(n) {
				if ( n < 0 ) return '+' + n;
				return n;
			}

			scope.isFree = function() {
				return scope.costs.length < 1;
			}
		}
	}
})

var attrOrder = ['hp', 'atk', 'def', 'spd'];
function compareAttrs(a, b) {
	if ( a === b ) return 0;
	var ia = _.indexOf(attrOrder, a);
	var ib = _.indexOf(attrOrder, b);
	if ( ia != -1 && ib != -1 ) return ia - ib;
	if ( ia != -1 ) return -1;
	if ( ib != -1 ) return 1;
	return (a < b) ? -1 : 1;
}

function kvs(o) {
	var result = _.transform(o, function(acc, value, key) {
		acc.push({key: key, value: value});
		return acc;
	}, []);

	result.sort(function(a, b) {
		return compareAttrs(a.key, b.key);
	})

	return result;
}

function DungeonController( $scope ) {

	$scope.Game = Game;

	$scope.eventColor = function(event) {
		if ( ! $scope.isAvailable(event) ) return 'black';
		if ( event.type == 'boss' ) return 'pink';
		if ( event.type == 'chest' ) return 'green';
		if ( event.type == 'merchant' ) return 'orange';
		if ( event.type == 'trap' ) return 'orange';
		return 'brown';
	}

	$scope.isAvailable = function(event) {
		if ( event.type == 'monster' || event.type == 'boss' )
			return event.combat.attackable;
		else if ( event.cost )
			return canPay(Game.dungeon.hero, event.cost);
	}

	$scope.activate = function(e) {
		Game.activateDungeonEvent(e);
	}

	$scope.isAtLimit = function(attr) {
		var v = $scope.hero.attributes[attr];
		var l = $scope.hero.limits[attr];
		return ( v == l.min || v == l.max );
	}

	$scope.enterDungeon = function(heroClass) {

		$scope.Game.state = 'dungeon';
		enterDungeon(heroClass, randomDungeonGenerator);

		console.log('monsters', Game.dungeon.monsterTable.freqs);
		console.log('bosses', Game.dungeon.bossPositions);

		$scope.dungeon = Game.dungeon;
		$scope.hero = $scope.dungeon.hero;
	}

	$scope.portraitClass = function(e) {
		if ( e.type == 'monster' || e.type == 'boss')
			return e.monster.id;
		return e.type;
	}

	$scope.skillAvailable = function(skill) {
		return canPay($scope.hero, {stars: skill.stars})
	}

	$scope.skillActivated = function(skill) {
		Game.activateSkill(skill);
	}

	$scope.xpBarPercent = function() {
		return Math.min( 1, $scope.hero.xp / $scope.hero.nextLevelXp ) * 100;
	}

	$scope.highlight = function(e) {
		if ( e.loot || e.item )
			$scope.hover = ( e.loot || e.item );
	}

	$scope.unhighlight = function() {
		$scope.hover = null;
	}

}