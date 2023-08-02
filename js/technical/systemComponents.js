function getActiveClass(layer){
	if(layer=='info-tab'){layer = 'Information'}
	if(layer=='options-tab'){layer = 'Setting'}
	if(layer=='changelog-tab'){layer = 'Changelog'}
	$("button").removeClass("active");
	$('#'+layer).addClass('active')
}

var systemComponents = {
	'tab-buttons': {
		props: ['layer', 'data', 'name'],
		template: `
			<div class="upgRow">
				<div v-for="tab in Object.keys(data)">
					<button v-if="data[tab].unlocked == undefined || data[tab].unlocked"
					v-bind:class="{
						tabButton: true,
						notify: subtabShouldNotify(layer, name, tab),
						resetNotify: subtabResetNotify(layer, name, tab),
						AcSub: tab==player.subtabs[layer][name]
					}"
					:class=""
					v-bind:id="[tab]"
					v-bind:style="[{'border-color': tmp[layer].color}, (data[tab].glowColor && subtabShouldNotify(layer, name, tab) ? {'box-shadow': 'var(--hqProperty2a), 0 0 20px '  + data[tab].glowColor} : {}), tmp[layer].componentStyles['tab-button'], data[tab].buttonStyle]"
					v-on:click="function(){
						player.subtabs[layer][name] = tab
						updateTabFormats()
						needCanvasUpdate = true
					}">{{tab}}</button>
			</div>
		`
	},

	'tree-node': {
		props: ['layer', 'abb', 'size', 'prev'],
		template: /*!*/`
		<button v-if="nodeShown(layer)"
			v-bind:id="layer"
			v-on:click="function() {
                /* if(layer.indexOf('metaSmall')+1){
                    console.log(layer)
                    fullResize(tmp[layer].subLayers)
					return
                } */
                /* if(layer.indexOf('small')+1){
                    console.log(layer)
                    resize(layer)
					return
                } */
				if(layer=='Information'){
					showTab('info-tab')
					getActiveClass('Information')
					return
				}
				if(layer=='Setting'){
					showTab('options-tab')
					getActiveClass('Setting')
					return
				}
				if(layer=='Changelog'){
					showTab('changelog-tab')
					getActiveClass('Changelog')
					return
				}
				if (shiftDown) player[layer].forceTooltip = !player[layer].forceTooltip
				else if(tmp[layer].isLayer) {
					if (tmp[layer].leftTab) {
						showNavTab(layer, prev)
						showTab('none')
					}
					else
						showTab(layer, prev)
				}
				else {run(layers[layer].onClick, layers[layer])}

				getActiveClass(layer)
			}"


			v-bind:class="{
				treeNode: tmp[layer].isLayer,
				treeButton: !tmp[layer].isLayer,
				smallNode: size == 'small',
				[layer]: true,
				tooltipBox: true,
				forceTooltip: player[layer].forceTooltip,
				ghost: tmp[layer].layerShown == 'ghost',
				hidden: !tmp[layer].layerShown,
				locked: tmp[layer].isLayer ? !(player[layer].unlocked || tmp[layer].canReset) : !(tmp[layer].canClick),
				notify: tmp[layer].notify && player[layer].unlocked,
				resetNotify: tmp[layer].prestigeNotify,
				can: ((player[layer].unlocked || tmp[layer].canReset) && tmp[layer].isLayer) || (!tmp[layer].isLayer && tmp[layer].canClick),
				front: !tmp.scrolled,
			}"
			v-bind:style="constructNodeStyle(layer)">
			<span v-html="(abb !== '' && tmp[layer].image === undefined) ? abb : '&nbsp;'"></span>
			<tooltip
      v-if="tmp[layer].tooltip != ''"
			:text="(tmp[layer].isLayer) ? (
				player[layer].unlocked ? (tmp[layer].tooltip ? tmp[layer].tooltip : formatWhole(player[layer].points) + ' ' + (options.ch?tmp[layer].resource:tmp[layer].resourceEN))
				: (tmp[layer].tooltipLocked ? options.ch? tmp[layer].tooltipLocked : tmp[layer].tooltipLockedEN : (options.ch?'达到 ':'Reach ') + formatWhole(tmp[layer].requires) + ' ' + (options.ch?tmp[layer].baseResource:tmp[layer].baseResourceEN) + (options.ch?' 以解锁 (你有 ':' to unlock (You have ') + formatWhole(tmp[layer].baseAmount) + ' ' + (options.ch?tmp[layer].baseResource:tmp[layer].baseResourceEN) + ')')
			)
			: (
				tmp[layer].canClick ? (tmp[layer].tooltip ? tmp[layer].tooltip : 'I am a button!')
				: (tmp[layer].tooltipLocked ? options.ch? tmp[layer].tooltipLocked : tmp[layer].tooltipLockedEN : 'I am a button!')
			)"></tooltip>
			<node-mark :layer='layer' :data='tmp[layer].marked'></node-mark></span>
		</button>
		`
	},

	
	'layer-tab': {
		props: ['layer', 'back', 'spacing', 'embedded'],
		template: `<div v-bind:style="[tmp[layer].style ? tmp[layer].style : {}, (tmp[layer].tabFormat && !Array.isArray(tmp[layer].tabFormat)) ? tmp[layer].tabFormat[player.subtabs[layer].mainTabs].style : {}]" class="noBackground">
		<div v-if="!tmp[layer].tabFormat">
			<div v-if="spacing" v-bind:style="{'height': spacing}" :key="this.$vnode.key + '-spacing'"></div>
			<infobox v-if="tmp[layer].infoboxes" :layer="layer" :data="Object.keys(tmp[layer].infoboxes)[0]":key="this.$vnode.key + '-info'"></infobox>
			<main-display v-bind:style="tmp[layer].componentStyles['main-display']" :layer="layer"></main-display>
			<div v-if="tmp[layer].type !== 'none'">
				<prestige-button v-bind:style="tmp[layer].componentStyles['prestige-button']" :layer="layer"></prestige-button>
			</div>
			<resource-display v-bind:style="tmp[layer].componentStyles['resource-display']" :layer="layer"></resource-display>
			<milestones v-bind:style="tmp[layer].componentStyles.milestones" :layer="layer"></milestones>
			<div v-if="Array.isArray(tmp[layer].midsection)">
				<column :layer="layer" :data="tmp[layer].midsection" :key="this.$vnode.key + '-mid'"></column>
			</div>
			<clickables v-bind:style="tmp[layer].componentStyles['clickables']" :layer="layer"></clickables>
			<buyables v-bind:style="tmp[layer].componentStyles.buyables" :layer="layer"></buyables>
			<upgrades v-bind:style="tmp[layer].componentStyles['upgrades']" :layer="layer"></upgrades>
			<challenges v-bind:style="tmp[layer].componentStyles['challenges']" :layer="layer"></challenges>
			<achievements v-bind:style="tmp[layer].componentStyles.achievements" :layer="layer"></achievements>
			<br><br>
		</div>
		<div v-if="tmp[layer].tabFormat">
				<column :layer="layer" :data="tmp[layer].tabFormat" :key="this.$vnode.key + '-col'"></column>
			</div>
			<div v-else>
				<div class="upgTable" v-bind:style="{'padding-top': (embedded ? '0' : '25px'), 'margin-top': (embedded ? '-10px' : '0'), 'margin-bottom': '24px'}">
					<tab-buttons v-bind:style="tmp[layer].componentStyles['tab-buttons']" :layer="layer" :data="tmp[layer].tabFormat" :name="'mainTabs'"></tab-buttons>
				</div>
				<layer-tab v-if="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].embedLayer" :layer="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].embedLayer" :embedded="true" :key="this.$vnode.key + '-' + layer"></layer-tab>
				<column v-else :layer="layer" :data="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].content" :key="this.$vnode.key + '-col'"></column>
			</div>
		</div></div>
			`
	},

	'overlay-head': {
		template: `
		`
    },

    'info-tab': {
        template: `
        <div><br><br><br>
        <h1>{{options.ch?modInfo.name:modInfo.nameEN}}</h1>
        <br><br><br>

        <h2>参与人员:</h2><br><br>
		<div style="border: 3px solid #888; width:300px; height:30px; margin-top: 8px; padding:15px; border-radius: 5px; display: inline-table">
			<h3>主要作者:</h3><br>
			辉影神秘<br><br>
			<h6 style="color:#aaa">(制作Set版本)</h6>
		</div>
		<div style="border: 3px solid #888; width:300px; height:30px; margin-top: 8px; padding:15px; border-radius: 5px; display: inline-table">
			<h3>次要作者:</h3><br>
			QwQe308<br><br>
			<h6 style="color:#aaa">(一些零碎的改动,主要是关于游戏体验)</h6>
		</div>
		<div style="border: 3px solid #888; width:300px; height:30px; margin-top: 8px; padding:15px; border-radius: 5px; display: inline-table">
			<h3>原游戏作者:</h3><br>
			Jacorb90<br><br>
			<h6 style="color:#aaa">(本Mod基于Jacorb90的The Formula制作)</h6>
		</div>
		<div style="border: 3px solid #888; width:300px; height:30px; margin-top: 8px; padding:15px; border-radius: 5px; display: inline-table">
			<h3>模板支持:</h3><br>
			Acamaeda<br><br>
			<h6 style="color:#aaa">(The Modding Tree <a v-bind:href="'https://github.com/Acamaeda/The-Modding-Tree/blob/master/changelog.md'" target="_blank" class="link" v-bind:style = "{'font-size': '10px', 'display': 'inline'}">{{TMT_VERSION.tmtNum}}</a>)</h6>
		</div>
		<div style="border: 3px solid #888; width:300px; height:30px; margin-top: 8px; padding:15px; border-radius: 5px; display: inline-table">
			<h3><spoiler>元</spoiler> 灵感来源:</h3><br>
			ducdat0507<br><br>
			<h6 style="color:#aaa">(灵感来源于 <spoiler>The Prestreestuck</spoiler> 的 <spoiler>Skaia</spoiler> 层)</h6>
		</div>

		<br><br><br><br>

        <h2>统计信息:</h2><br><br>
		<div style="border: 3px solid #888; width:300px; height:30px; margin-top: 8px; padding:15px; border-radius: 5px; display: inline-table">
			<h3>游戏时长:</h3><br>
			{{ formatTime(player.timePlayed) }}<br><br>
			<h6 style="color:#aaa">(随着游戏进度这里的项目会越来越多)</h6>
		</div>
		<div style="border: 3px solid #888; width:300px; height:30px; margin-top: 8px; padding:15px; border-radius: 5px; display: inline-table">
			<h3>本次重置时间因素:</h3><br>
			{{ format(player.points) + ' = ' + formatTime(player.points) }}<br><br>
			<h6 style="color:#aaa">(我不知道我应该在这行字里写什么)</h6>
		</div>
		<div style="border: 3px solid #888; width:300px; height:30px; margin-top: 8px; padding:15px; border-radius: 5px; display: inline-table">
			<h3>已完成目标:</h3><br>
			{{ formatWhole(n(tmp.goals.achsCompleted)) + (n(tmp.ac.achsCompleted).gte(1) || tmp.goals.unlocks>=3 ? (' + ' + formatWhole(n(tmp.ac.achsCompleted))) + ' = ' + formatWhole(n(tmp.goals.achsCompleted).add(tmp.ac.achsCompleted)) : ('')) }}<br><br>
			<h6 style="color:#aaa">(但是为了美观我得写这些)</h6>
		</div>
		<div v-if="n(tmp.ac.achsCompleted).gte(1) || tmp.goals.unlocks>=3" style="border: 3px solid #888; width:300px; height:30px; margin-top: 8px; padding:15px; border-radius: 5px; display: inline-table">
			<h3>已完成荣耀:</h3><br>
			{{ formatWhole(n(tmp.ac.achsCompleted)) }}<br><br>
			<h6 style="color:#aaa">(已经糊完2句话了,让我想想这里写什么)</h6>
		</div>
		<div v-if="player.meta.level.gte(1) || tmp.goals.unlocks>=8" style="border: 3px solid #888; width:300px; height:30px; margin-top: 8px; padding:15px; border-radius: 5px; display: inline-table">
			<h3>回切阶层等级:</h3><br>
			{{ formatWhole(player.meta.level) + ' (总计: ' +formatWhole(player.meta.levelTotal)+ ')' }}<br><br>
			<h6 style="color:#aaa">(...)</h6>
		</div>
		<div v-if="player.meta.level.gte(1) || tmp.goals.unlocks>=8" style="border: 3px solid #888; width:300px; height:30px; margin-top: 8px; padding:15px; border-radius: 5px; display: inline-table">
			<h3>回切指数塔等级:</h3><br>
			{{ formatWhole(player.meta.tower) }}<br><br>
			<h6 style="color:#aaa">(....)</h6>
		</div>

		<br><br><br><br>
		
        <h2>其它页面:</h2><br><br>
		<div style="border: 3px solid #888; width:300px; height:30px; margin-top: 8px; padding:15px; border-radius: 5px; display: inline-table">
			<h3>我(辉影神秘)的Discord:</h3><br>
			<a class="link" href="https://discord.gg/DTJYvatRQA" target="_blank">点击跳转</a><br>
			<h6 style="color:#aaa">(快点来,非常好玩)</h6>
		</div>
		<div style="border: 3px solid #888; width:300px; height:30px; margin-top: 8px; padding:15px; border-radius: 5px; display: inline-table">
			<h3>捐助页面:</h3><br>
			<a class="link" href="https://afdian.net/@Mysterious124" target="_blank">点击跳转</a><br>
			<h6 style="color:#aaa">($_$)</h6>
		</div>
		<div style="border: 3px solid #888; width:300px; height:30px; margin-top: 8px; padding:15px; border-radius: 5px; display: inline-table">
			<h3>更新日志:</h3><br>
			<a class="link" onclick="showTab('changelog-tab');getActiveClass('Changelog')">点击跳转</a><br>
			<h6 style="color:#aaa">(其实也可以点右上角的版本号)</h6>
		</div>
		<div style="border: 3px solid #888; width:300px; height:30px; margin-top: 8px; padding:15px; border-radius: 5px; display: inline-table">
			<h3>模组树Discord:</h3><br>
			<a class="link" href="https://discord.gg/F3xveHV" target="_blank">点击跳转</a><br>
			<h6 style="color:#aaa">(就是这些)</h6>
		</div>
    `
    },

    'options-tab': {
        template: ` 
        <table><br><br><br><br><br><br>
            <tr>
				<td><button class="opt" onclick="save()">{{options.ch?'本地存档' :'Save'}}</button></td>
                <td><button class="opt" onclick="toggleOpt('autosave')">{{options.ch?'自动存档' :'AutoSave'}}: {{ options.autosave?(options.ch?"已开启":"ON"):(options.ch?"已关闭":"OFF") }}</button></td>
                <td><button class="opt" onclick="hardReset()">{{options.ch?'硬重置(删除存档)' :'HardReset'}}</button></td>
				<td><button class="opt" onclick="exportSave()">{{options.ch?'导出存档(复制到黏贴板)' :'Export'}}</button></td>
				<td><button class="opt" onclick="importSave()">{{options.ch?'导入存档':'Import'}}</button></td>
			</tr><br>
			<tr>
                <td><button class="opt" onclick="toggleOpt('offlineProd')">{{options.ch?'离线进度' :'Offline Prod'}}: {{ options.offlineProd?(options.ch?"已开启":"ON"):(options.ch?"已关闭":"OFF") }}</button></td>
            </tr><br>
            <tr>
                <td><button class="opt" onclick="toggleOpt('hideChallenges')">{{options.ch?'已完成挑战':'Completed Challenges'}}: {{ options.hideChallenges?(options.ch?"隐藏":"HIDDEN"):(options.ch?"显示":"SHOWN") }}</button></td>
                <td><button class="opt" onclick="adjustMSDisp()">{{options.ch?'显示里程碑':'Show Milestones'}}: {{options.ch? MS_DISPLAYS[MS_SETTINGS.indexOf(options.msDisplay)] : MS_DISPLAYS_EN[MS_SETTINGS.indexOf(options.msDisplay)]}}</button></td>
                <td><button class="opt" onclick="toggleOpt('forceOneTab'); needsCanvasUpdate = true">{{options.ch?'节点内容占据整个屏幕':'Single-Tab Mode'}}: {{ options.forceOneTab?(options.ch?"永远这样":"ALWAYS"):(options.ch?"自动调节":"AUTO") }}</button></td>
			</tr> <br>
			<tr>
                <td><button class="opt" onclick="toggleOpt('mouse')">优化鼠标操作: {{ options.mouse ? "启用":"关闭"}}</button></td>
			</tr><br>
			<tr>
				<td><button class="opt" onclick="
                options.ch = !options.ch;
                needsCanvasUpdate = true; document.title = options.ch?'集合公式':'The Set Formula';
                VERSION.withName = VERSION.withoutName + (VERSION.name ? ': ' + (options.ch? VERSION.name :VERSION.nameEN) : '')
                ">{{options.ch?'语言':'Language'}}: {{ options.ch?"中文(Chinese)":"英文(English)" }}</button></td>
			</tr>
        </table>`
    },

    'back-button': {
        template: `
        <button v-bind:class="back" onclick="goBack()">←</button>
        `
    },


	'tooltip' : {
		props: ['text'],
		template: `<div class="tooltip" v-html="text"></div>
		`
	},

	'node-mark': {
		props: {'layer': {}, data: {}, offset: {default: 0}, scale: {default: 1}},
		template: `<div v-if='data'>
			<div v-if='data === true' class='star' v-bind:style='{position: "absolute", left: (offset-10) + "px", top: (offset-10) + "px", transform: "scale( " + scale||1 + ", " + scale||1 + ")"}'></div>
			<img v-else class='mark' v-bind:style='{position: "absolute", left: (offset-22) + "px", top: (offset-15) + "px", transform: "scale( " + scale||1 + ", " + scale||1 + ")"}' v-bind:src="data"></div>
		</div>
		`
	},

	'particle': {
		props: ['data', 'index'],
		template: `<div><div class='particle instant' v-bind:style="[constructParticleStyle(data), data.style]" 
			v-on:click="run(data.onClick, data)"  v-on:mouseenter="run(data.onMouseOver, data)" v-on:mouseleave="run(data.onMouseLeave, data)" ><span v-html="data.text"></span>
		</div>
		<svg version="2" v-if="data.color">
		<mask v-bind:id="'pmask' + data.id">
        <image id="img" v-bind:href="data.image" x="0" y="0" :height="data.width" :width="data.height" />
    	</mask>
    	</svg>
		</div>
		`
	},

	'bg': {
		props: ['layer'],
		template: `<div class ="bg" v-bind:style="[tmp[layer].style ? tmp[layer].style : {}, (tmp[layer].tabFormat && !Array.isArray(tmp[layer].tabFormat)) ? tmp[layer].tabFormat[player.subtabs[layer].mainTabs].style : {}]"></div>
		`
	}

}

