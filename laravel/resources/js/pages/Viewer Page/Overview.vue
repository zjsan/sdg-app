<template>
    <Authenticated>
        <div class="p-6 lg:p-12 w-full mx-auto max-w-6xl h-full overflow-y-auto">

            <!--hero-->
            <section class="mb-16    border-b pb-8">
                <div class="max-w-3xl">
                    <h1 class="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                        PHEI SDG DASHBOARD
                    </h1>
                    <p class="text-xl text-slate-600 leading-relaxed">
                        A dedicated platform designed to monitor, analyze, and visualize the impact of 
                        Philippine Higher Education Institutions (HEIs) in achieving the 
                        United Nations Sustainable Development Goals.
                    </p>
                </div>
            </section>

          
            <!--About the project-->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                <div>
                    <h2 class="text-sm font-bold uppercase tracking-widest text-blue-600 mb-3">The Project</h2>
                    <p class="text-slate-700 leading-relaxed">
                        The <strong>Philippine HEI SDG Dashboard</strong> is an initiative by the 
                        MMSU SDG Research Team. It serves as a centralized hub for stakeholders 
                        to understand how local universities are contributing to global sustainability. 
                        By harmonizing complex data from <em>THE Impact Rankings</em>, we provide 
                        a clear picture of institutional progress across the Philippines.
                    </p>
                </div>
                <div>
                    <h2 class="text-sm font-bold uppercase tracking-widest text-indigo-600 mb-3">The Objective</h2>
                    <p class="text-slate-700 leading-relaxed">
                        Our goal is to foster a data-driven culture within Philippine academia. 
                        Whether you are a researcher, university administrator, or policy maker, 
                        this portal provides the evidence needed to drive institutional 
                        improvements and regional collaboration.
                    </p>
                </div>
            </div>

            <!--What can you do-->
            <div class="bg-slate-900 text-white py-20 px-6 rounded-[2rem] shadow-2xl mb-16 border border-white/5">
    <section class="max-w-6xl mx-auto">
      <header class="text-center mb-16">
        <h2 class="text-3xl md:text-5xl font-extrabold tracking-tight">
          What can you do with the <span class="text-blue-400">dashboard?</span>
        </h2>
      </header>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <div 
                v-for="feature in features" 
                :key="feature.title"
                class="group relative bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 
                        hover:bg-white/10 hover:border-white/20 transition-all duration-500 cursor-pointer 
                        hover:-translate-y-2"
                >
                <div :class="[feature.bg, feature.color, 'w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3']">
                    <i :class="['pi text-2xl', feature.icon]"></i>
                </div>

                <h4 class="font-bold text-xl mb-3 group-hover:text-blue-300 transition-colors">
                    {{ feature.title }}
                </h4>
                <p class="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                    {{ feature.description }}
                </p>
                
                <div class="absolute -inset-px rounded-3xl border-2 border-transparent group-hover:border-blue-500/20 pointer-events-none" />
                </div>
            </div>
            </section>
        </div>

            <!--Get started section-->
              <section>
                <h2 class="text-lg font-bold text-slate-900 mb-6">Get Started</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <router-link to="/dashboard" class="group p-6 bg-blue-600 rounded-2xl flex items-center justify-between transition-all hover:bg-blue-700">
                        <div class="text-white">
                            <p class="font-bold text-lg">Go to Live Dashboard</p>
                            <p class="text-blue-100 text-sm">Start exploring interactive SDG data.</p>
                        </div>
                        <i class="pi pi-arrow-right text-white transition-transform group-hover:translate-x-2"></i>
                    </router-link>

                    <router-link to="/manual" class="group p-6 bg-white border border-slate-200 rounded-2xl flex items-center justify-between transition-all hover:border-blue-300">
                        <div>
                            <p class="font-bold text-slate-800 text-lg">Read User Manual</p>
                            <p class="text-slate-500 text-sm">New here? Learn how to use the dashboard tools.</p>
                        </div>
                        <i class="pi pi-chevron-right text-slate-400"></i>
                    </router-link>
                </div>
            </section>
        </div>
    </Authenticated>
</template>
<script setup>
import Authenticated from "./../Dashboard Template/Layout/Authenticated.vue";


const features = [
  {
    title: 'Regional Comparison',
    description: 'Filter and compare SDG performance across different Philippine regions.',
    icon: 'pi-map',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    title: 'Trend Analysis',
    description: 'Track institutional progress and identify high-performing impact areas.',
    icon: 'pi-chart-line',
    color: 'text-green-400',
    bg: 'bg-green-400/10',
  },
  {
    title: 'SDG Performance Insights',
    description: 'Identify strengths, gaps, and opportunities across SDGs using harmonized institutional data.',
    icon: 'pi-search',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
  },
];


</script>