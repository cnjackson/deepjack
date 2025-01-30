<template>
	<div class="app-container">
		<i class="settings-icon fas fa-cog" @click="toggleSettings"></i>
		<SettingsPanel :show-settings="showSettings" :gpu-available="gpuAvailable" @save-settings="handleSaveSettings" />
		<h1>LLM Chat Application</h1>
		<Chat :conversation="conversation" :thinking="thinking" @generate="handleGenerate" @clear="handleClear" />
	</div>
</template>

<script>
import Chat from "./components/Chat.vue";
import SettingsPanel from "./components/SettingsPanel.vue";

export default {
	components: { Chat, SettingsPanel },
	data() {
		return {
			conversation: [],
			thinking: false,
			showSettings: false,
			gpuAvailable: false,
			settings: {
				enableGPU: false,
				historyLimit: 10,
			},
		};
	},
	mounted() {
		this.detectGPU();
		this.loadSettings();
	},
	methods: {
		async handleGenerate(prompt) {
			this.thinking = true;
			try {
				const response = await fetch("/api/generate", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						prompt,
						settings: this.settings,
					}),
				});
				const data = await response.json();
				this.conversation.push({ role: "user", content: prompt }, { role: "assistant", content: data.response });
			} catch (error) {
				console.error("Error:", error);
			} finally {
				this.thinking = false;
			}
		},
		async handleClear() {
			try {
				await fetch("/api/clear", { method: "POST" });
				this.conversation = [];
			} catch (error) {
				console.error("Error:", error);
			}
		},
		detectGPU() {
			const canvas = document.createElement("canvas");
			const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
			this.gpuAvailable = !!gl;
		},
		toggleSettings() {
			this.showSettings = !this.showSettings;
		},
		handleSaveSettings(settings) {
			this.settings = { ...this.settings, ...settings };
			localStorage.setItem("appSettings", JSON.stringify(this.settings));
		},
		loadSettings() {
			const saved = localStorage.getItem("appSettings");
			if (saved) {
				try {
					this.settings = JSON.parse(saved);
				} catch (error) {
					console.error("Error loading settings:", error);
				}
			}
		},
	},
};
</script>

<style lang="scss">
@use "./assets/styles/main.scss" as *;
</style>
