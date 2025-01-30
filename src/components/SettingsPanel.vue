<template>
	<div class="settings-panel" :class="{ visible: showSettings }">
		<h3>Settings</h3>
		<div class="settings-item">
			<label>
				<input type="checkbox" v-model="settings.enableGPU" :disabled="!gpuAvailable" />
				Enable GPU Acceleration
			</label>
			<div class="gpu-status" :class="gpuAvailable ? 'gpu-available' : 'gpu-unavailable'">
				{{ gpuAvailable ? "GPU Available" : "GPU Not Available" }}
			</div>
		</div>
		<button @click="saveSettings">Save Settings</button>
	</div>
</template>

<script>
export default {
	props: ["showSettings", "gpuAvailable"],
	data() {
		return {
			settings: {
				enableGPU: false,
			},
		};
	},
	methods: {
		saveSettings() {
			this.$emit("save-settings", this.settings);
		},
	},
};
</script>
