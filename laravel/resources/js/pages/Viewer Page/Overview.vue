<template>
    <Authenticated>
        <div class="p-6 lg:p-12 w-full mx-auto max-w-6xl h-full overflow-y-auto">
            <section class="mb-16 border-b pb-8">
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

            <section class="mb-16 p-10 bg-slate-50 rounded-[3rem] border border-slate-100">
                <h2 class="text-2xl font-bold text-slate-900 mb-8 text-center">What can you do with this portal?</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div class="flex flex-col items-center text-center">
                        <div class="w-14 h-14 bg-white shadow-sm rounded-2xl flex items-center justify-center mb-4 text-blue-500 text-xl">
                            <i class="pi pi-map"></i>
                        </div>
                        <h4 class="font-bold text-slate-800">Regional Comparison</h4>
                        <p class="text-sm text-slate-500 mt-2">Filter and compare SDG performance across different Philippine regions.</p>
                    </div>
                    <div class="flex flex-col items-center text-center">
                        <div class="w-14 h-14 bg-white shadow-sm rounded-2xl flex items-center justify-center mb-4 text-green-500 text-xl">
                            <i class="pi pi-chart-line"></i>
                        </div>
                        <h4 class="font-bold text-slate-800">Trend Analysis</h4>
                        <p class="text-sm text-slate-500 mt-2">Track institutional progress and identify high-performing impact areas.</p>
                    </div>
                    <div class="flex flex-col items-center text-center">
                        <div class="w-14 h-14 bg-white shadow-sm rounded-2xl flex items-center justify-center mb-4 text-orange-500 text-xl">
                            <i class="pi pi-file-export"></i>
                        </div>
                        <h4 class="font-bold text-slate-800">SDG Performance Insights</h4>
                        <p class="text-sm text-slate-500 mt-2"> Identify strengths, gaps, and opportunities across SDGs using harmonized institutional data.</p>
                    </div>
                </div>
            </section>

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
</script>