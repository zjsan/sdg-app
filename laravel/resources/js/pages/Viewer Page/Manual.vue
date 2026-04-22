<template>
    <Authenticated>
        <div class="p-6 lg:p-10 w-full mx-auto overflow-y-auto h-full">
            <header class="mb-10 border-b pb-8">
                <div class="flex items-center space-x-3 mb-2">
                    <h1
                        class="text-3xl font-bold text-slate-900 tracking-tight"
                    >
                        Dashboard User Manual
                    </h1>
                </div>
                <p class="text-slate-600 text-lg">
                    A comprehensive guide in interacting with the Philippine
                    Higher Education Institution (PHEI) SDG Dashboard.
                </p>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section class="space-y-4">
                    <div class="flex items-center space-x-2 text-blue-600">
                        <i class="pi pi-filter-fill"></i>
                        <h2 class="font-bold uppercase text-sm tracking-wider">
                            Navigation & Filtering
                        </h2>
                    </div>
                    <div
                        class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
                    >
                        <ul class="space-y-4">
                            <li class="flex gap-3">
                                <span class="font-mono text-blue-500 font-bold"
                                    >01.</span
                                >
                                <div>
                                    <p class="font-semibold text-slate-800">
                                        Dashboard Navigation Links
                                    </p>
                                    <p class="text-sm text-slate-500">
                                        Click the menus at the top of the
                                        dashboard to navigate through the
                                        different report tabs.
                                    </p>
                                </div>
                            </li>
                            <li class="flex gap-3">
                                <span class="font-mono text-blue-500 font-bold"
                                    >02.</span
                                >
                                <div>
                                    <p class="font-semibold text-slate-800">
                                        Slicer Panes
                                    </p>
                                    <p class="text-sm text-slate-500">
                                        Use the dropdown menus at the top/side
                                        of the dashboard to filter by Region,
                                        Institution, or specific SDG targets.
                                    </p>
                                </div>
                            </li>
                            <li class="flex gap-3">
                                <span class="font-mono text-blue-500 font-bold"
                                    >03.</span
                                >
                                <div>
                                    <p class="font-semibold text-slate-800">
                                        Cross-Highlighting
                                    </p>
                                    <p class="text-sm text-slate-500">
                                        Clicking on a specific segment in a
                                        chart (e.g., a bar or pie slice) will
                                        automatically filter all other visuals
                                        on the page to match that selection.
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>

                <section class="space-y-4">
                    <div class="flex items-center space-x-2 text-indigo-600">
                        <i class="pi pi-search-plus"></i>
                        <h2 class="font-bold uppercase text-sm tracking-wider">
                            Data Exploration
                        </h2>
                    </div>
                    <div
                        class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
                    >
                        <ul class="space-y-4">
                            <li class="flex gap-3">
                                <span
                                    class="font-mono text-indigo-500 font-bold"
                                    >01.</span
                                >
                                <div>
                                    <p class="font-semibold text-slate-800">
                                        Hover Tooltips
                                    </p>
                                    <p class="text-sm text-slate-500">
                                        Hover your cursor over data points to
                                        reveal "Tooltips"—pop-up boxes
                                        containing the exact raw scores and
                                        secondary metrics.
                                    </p>
                                </div>
                            </li>
                            <li class="flex gap-3">
                                <span
                                    class="font-mono text-indigo-500 font-bold"
                                    >02.</span
                                >
                                <div>
                                    <p class="font-semibold text-slate-800">
                                        Focus Mode
                                    </p>
                                    <p class="text-sm text-slate-500">
                                        Hover over any visual and click the
                                        <i
                                            class="pi pi-external-link text-[10px]"
                                        ></i>
                                        icon to expand that specific chart to
                                        the full canvas width.
                                    </p>
                                </div>
                            </li>
                            <li class="flex gap-3">
                                <span
                                    class="font-mono text-indigo-500 font-bold"
                                    >03.</span
                                >
                                <div>
                                    <p class="font-semibold text-slate-800">
                                        Show as a table
                                    </p>
                                    <p class="text-sm text-slate-500">
                                        Hover over any visual;
                                        <strong>if available</strong> and click
                                        the
                                        <i
                                            class="pi pi-ellipsis-v text-[10px]"
                                        ></i>
                                        (More options) icon, then select
                                        <b>Show as a table</b> to display the
                                        underlying data in a tabular format.
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>

                <section class="md:col-span-2 space-y-4">
                    <div class="flex items-center space-x-2 text-slate-600">
                        <i class="pi pi-cog"></i>
                        <h2 class="font-bold uppercase text-sm tracking-wider">
                            Advanced Controls
                        </h2>
                    </div>
                    <div
                        class="bg-slate-900 text-white p-8 rounded-3xl shadow-xl"
                    >
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <h4 class="text-blue-400 font-bold mb-2">
                                    Reset View
                                </h4>
                                <p class="text-sm text-slate-300">
                                    To clear all active filters and return to
                                    the original report state, click the
                                    <strong>Reset to Default</strong> button at
                                    the top right of the Power BI toolbar.
                                </p>
                            </div>
                            <div>
                                <h4 class="text-blue-400 font-bold mb-2">
                                    Drill-Through
                                </h4>
                                <p class="text-sm text-slate-300">
                                    Right-click on a data point (like a specific
                                    University name) to see if a
                                    <strong>Drill-through</strong> option is
                                    available for more granular HEI profiles.
                                </p>
                            </div>
                            <div>
                                <h4 class="text-blue-400 font-bold mb-2">
                                    Exporting
                                </h4>
                                <p class="text-sm text-slate-300">
                                    Click the
                                    <i class="pi pi-ellipsis-h"></i> (More
                                    options) on any visual to export the
                                    underlying data to <strong>Excel</strong> or
                                    <strong>CSV</strong> format.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <footer
                class="mt-12 p-6 bg-slate-50 border border-slate-100 rounded-2xl"
            >
                <div class="flex items-start space-x-3">
                    <i class="pi pi-shield text-blue-500 mt-1"></i>
                    <div>
                        <p class="text-sm font-bold text-slate-800">
                            Report Scope & Data Source Integrity
                        </p>
                        <p class="text-xs text-slate-500 leading-relaxed mt-1">
                            The insights presented in the dashboard are
                            collected from
                            <strong>THE DataPoints</strong> website. Data is
                            processed through a harmonization layer to ensure
                            standardized comparison across different Higher
                            Education Institutions (HEIs) and their respective
                            SDG impact scores.
                        </p>
                        <p class="text-xs text-slate-500 leading-relaxed mt-1">
                            <strong>Note:</strong> Updates to
                            <strong>THE DataPoints</strong> website are not
                            automatically reflected in real-time in the PHEI SDG
                            Dashboard. New data is subject to a scheduled
                            collection and pre-processing cycle to maintain data
                            integrity.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    </Authenticated>
</template>
<script setup>
import Authenticated from "./../Dashboard Template/Layout/Authenticated.vue";
</script>
