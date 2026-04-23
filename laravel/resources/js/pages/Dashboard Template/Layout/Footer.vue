<template>
    <footer class="border-t border-slate-200 bg-white">
        <div class="max-w-7xl mx-auto px-6 py-2">
            <div
                class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
            >
                <!-- Left: System Info -->
                <div>
                    <h3 class="text-sm font-semibold text-slate-800">
                        PHEI SDG Dashboard
                    </h3>
                    <p
                        class="text-xs text-slate-500 mt-1 max-w-md leading-relaxed"
                    >
                        A data-driven platform for analyzing the performance of
                        Philippine Higher Education Institutions (HEIs) across
                        the United Nations Sustainable Development Goals (SDGs).
                    </p>
                </div>

                <!-- Center: Navigation -->
                <div class="flex flex-wrap gap-4 text-xs text-slate-500">
                    <a href="/dashboard" class="hover:text-blue-600">
                        Dashboard
                    </a>
                    <a href="/methodology" class="hover:text-blue-600">
                        Methodology
                    </a>
                    <a href="/user-manual" class="hover:text-blue-600">
                        User Manual
                    </a>
                </div>

                <!-- Right: Attribution -->
                <div class="text-xs text-slate-400 max-w-xs leading-relaxed">
                    Data sourced from Times Higher Education (THE) including
                    Impact Rankings and DataPoints.
                </div>
            </div>

            <!-- Bottom Strip -->
            <div
                class="mt-6 pt-4 border-t border-slate-100 flex flex-col lg:flex-row justify-between text-xs text-slate-400"
            >
                <span>
                    © {{ new Date().getFullYear() }} PHEI SDG Dashboard
                </span>
                <span> All rights reserved </span>
            </div>
        </div>
    </footer>
</template>
