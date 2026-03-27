<template>
  <div class="bg-gray-950 min-h-screen pt-20">

    <!-- Ambient background glows -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-0 left-1/4 w-[700px] h-[700px] bg-violet-600/8 rounded-full blur-[140px]"></div>
      <div class="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-[120px]"></div>
      <div class="absolute inset-0 opacity-[0.02]"
        style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 40px 40px;"></div>
    </div>

    <div class="relative max-w-6xl mx-auto px-6 py-12">

      <!-- ── PAGE HEADER ── -->
      <div class="mb-10">
        <div class="inline-flex items-center gap-2 mb-3">
          <div class="w-5 h-px bg-violet-500"></div>
          <span class="text-xs font-semibold text-violet-400 uppercase tracking-widest">Account</span>
        </div>
        <h1 class="text-4xl font-black text-white tracking-tight">My Profile</h1>
        <p class="text-gray-500 mt-2">Manage your identity, preferences, and security</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <!-- ══════════════════════════════ -->
        <!-- LEFT COLUMN — Identity Card   -->
        <!-- ══════════════════════════════ -->
        <div class="lg:col-span-4 space-y-5">

          <!-- Avatar card -->
          <div class="relative rounded-2xl border border-white/8 bg-gray-900/60 backdrop-blur-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
            <!-- Banner gradient -->
            <div class="h-28 bg-gradient-to-br from-violet-600/40 via-indigo-600/30 to-purple-600/20 relative overflow-hidden">
              <div class="absolute inset-0 opacity-[0.07]"
                style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 20px 20px;"></div>
              <div class="absolute top-3 right-3">
                <span
                  :class="roleBadgeClass"
                  class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-sm">
                  {{ authStore.user?.role || 'Attendee' }}
                </span>
              </div>
            </div>

            <!-- Avatar -->
            <div class="px-6 pb-6">
              <div class="relative -mt-12 mb-4 w-fit">
                <div class="relative w-24 h-24 rounded-2xl border-4 border-gray-900 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                  <img
                    v-if="avatarPreview || form.avatar_url"
                    :src="avatarPreview || form.avatar_url"
                    alt="Profile photo"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                    <span class="text-2xl font-black text-white">{{ getInitials(form.name) }}</span>
                  </div>
                </div>
                <!-- Camera overlay -->
                <button
                  @click="$refs.avatarInput.click()"
                  class="absolute inset-0 w-24 h-24 rounded-2xl bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 border-4 border-gray-900"
                >
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <input ref="avatarInput" type="file" accept="image/*" class="hidden" @change="handleAvatarChange" />
              </div>

              <h2 class="text-lg font-black text-white">{{ form.name || 'Your Name' }}</h2>
              <p class="text-sm text-gray-500 mb-1">{{ form.email }}</p>
              <p v-if="form.username" class="text-xs text-violet-400">@{{ form.username }}</p>

              <!-- Photo actions -->
              <div class="flex gap-2 mt-4">
                <button
                  @click="$refs.avatarInput.click()"
                  class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/20 hover:border-violet-500/40 transition-all duration-200"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  Upload
                </button>
                <button
                  v-if="avatarPreview || form.avatar_url"
                  @click="removeAvatar"
                  class="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/15 hover:border-red-500/30 transition-all duration-200"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  Remove
                </button>
              </div>
            </div>
          </div>

          <!-- Quick stats -->
          <div class="rounded-2xl border border-white/8 bg-gray-900/60 backdrop-blur-xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Activity</h3>
            <div class="space-y-3">
              <div v-for="stat in profileStats" :key="stat.label" class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <div class="w-7 h-7 rounded-lg flex items-center justify-center" :class="stat.bg">
                    <svg class="w-3.5 h-3.5" :class="stat.color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stat.icon" />
                    </svg>
                  </div>
                  <span class="text-xs text-gray-400">{{ stat.label }}</span>
                </div>
                <span class="text-sm font-bold text-white">{{ stat.value }}</span>
              </div>
            </div>
          </div>

          <!-- Nav links -->
          <div class="rounded-2xl border border-white/8 bg-gray-900/60 backdrop-blur-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-all duration-200 border-b border-white/5 last:border-0"
              :class="activeTab === tab.id
                ? 'bg-violet-500/10 text-violet-300 border-l-2 border-l-violet-500'
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/3'"
            >
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tab.icon" />
              </svg>
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- ══════════════════════════════ -->
        <!-- RIGHT COLUMN — Tab Content    -->
        <!-- ══════════════════════════════ -->
        <div class="lg:col-span-8 space-y-5">

          <!-- ── TAB: PERSONAL INFO ── -->
          <template v-if="activeTab === 'personal'">
            <div class="rounded-2xl border border-white/8 bg-gray-900/60 backdrop-blur-xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              <div class="flex items-center justify-between mb-6">
                <div>
                  <h2 class="text-lg font-black text-white">Personal Information</h2>
                  <p class="text-xs text-gray-600 mt-0.5">Your public identity on EventHub</p>
                </div>
                <div class="w-8 h-8 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/15">
                  <svg class="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
              </div>

              <form @submit.prevent="updateProfile" class="space-y-5">
                <!-- Name + Username -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Full Name</label>
                    <input
                      v-model="form.name"
                      type="text"
                      placeholder="John Doe"
                      class="w-full px-4 py-3 rounded-xl bg-white/3 border border-white/8 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-violet-500/50 focus:bg-white/5 focus:ring-1 focus:ring-violet-500/20 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Username</label>
                    <div class="relative">
                      <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm">@</span>
                      <input
                        v-model="form.username"
                        type="text"
                        placeholder="johndoe"
                        class="w-full pl-8 pr-4 py-3 rounded-xl bg-white/3 border border-white/8 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-violet-500/50 focus:bg-white/5 focus:ring-1 focus:ring-violet-500/20 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                <!-- Email + Phone -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Email Address</label>
                    <input
                      v-model="form.email"
                      type="email"
                      placeholder="john@example.com"
                      class="w-full px-4 py-3 rounded-xl bg-white/3 border border-white/8 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-violet-500/50 focus:bg-white/5 focus:ring-1 focus:ring-violet-500/20 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Phone Number</label>
                    <input
                      v-model="form.phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      class="w-full px-4 py-3 rounded-xl bg-white/3 border border-white/8 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-violet-500/50 focus:bg-white/5 focus:ring-1 focus:ring-violet-500/20 transition-all duration-200"
                    />
                  </div>
                </div>

                <!-- Date of Birth + Gender -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Date of Birth</label>
                    <input
                      v-model="form.dob"
                      type="date"
                      class="w-full px-4 py-3 rounded-xl bg-white/3 border border-white/8 text-gray-300 text-sm focus:outline-none focus:border-violet-500/50 focus:bg-white/5 focus:ring-1 focus:ring-violet-500/20 transition-all duration-200"
                      style="color-scheme: dark"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Gender</label>
                    <select
                      v-model="form.gender"
                      class="w-full px-4 py-3 rounded-xl bg-white/3 border border-white/8 text-gray-300 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all duration-200 cursor-pointer"
                      style="background-color: rgb(17 24 39 / 0.8)"
                    >
                      <option value="" class="bg-gray-900">Prefer not to say</option>
                      <option value="male" class="bg-gray-900">Male</option>
                      <option value="female" class="bg-gray-900">Female</option>
                      <option value="non-binary" class="bg-gray-900">Non-binary</option>
                      <option value="other" class="bg-gray-900">Other</option>
                    </select>
                  </div>
                </div>

                <!-- Location -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">City</label>
                    <input
                      v-model="form.city"
                      type="text"
                      placeholder="New York"
                      class="w-full px-4 py-3 rounded-xl bg-white/3 border border-white/8 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-violet-500/50 focus:bg-white/5 focus:ring-1 focus:ring-violet-500/20 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Country</label>
                    <input
                      v-model="form.country"
                      type="text"
                      placeholder="United States"
                      class="w-full px-4 py-3 rounded-xl bg-white/3 border border-white/8 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-violet-500/50 focus:bg-white/5 focus:ring-1 focus:ring-violet-500/20 transition-all duration-200"
                    />
                  </div>
                </div>

                <!-- Bio -->
                <div>
                  <label class="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Bio</label>
                  <textarea
                    v-model="form.bio"
                    rows="3"
                    placeholder="Tell the community a bit about yourself..."
                    class="w-full px-4 py-3 rounded-xl bg-white/3 border border-white/8 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-violet-500/50 focus:bg-white/5 focus:ring-1 focus:ring-violet-500/20 transition-all duration-200 resize-none"
                  ></textarea>
                  <p class="text-right text-xs text-gray-700 mt-1">{{ (form.bio || '').length }}/280</p>
                </div>

                <!-- Website + Social -->
                <div>
                  <label class="block text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Links & Social</label>
                  <div class="space-y-3">
                    <div class="relative">
                      <div class="absolute left-4 top-1/2 -translate-y-1/2">
                        <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                      </div>
                      <input v-model="form.website" type="url" placeholder="https://yourwebsite.com"
                        class="w-full pl-11 pr-4 py-3 rounded-xl bg-white/3 border border-white/8 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-violet-500/50 focus:bg-white/5 focus:ring-1 focus:ring-violet-500/20 transition-all duration-200" />
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div class="relative">
                        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-xs font-semibold">𝕏</span>
                        <input v-model="form.twitter" type="text" placeholder="@handle"
                          class="w-full pl-9 pr-4 py-3 rounded-xl bg-white/3 border border-white/8 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-violet-500/50 focus:bg-white/5 focus:ring-1 focus:ring-violet-500/20 transition-all duration-200" />
                      </div>
                      <div class="relative">
                        <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        <input v-model="form.linkedin" type="text" placeholder="linkedin.com/in/..."
                          class="w-full pl-10 pr-4 py-3 rounded-xl bg-white/3 border border-white/8 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-violet-500/50 focus:bg-white/5 focus:ring-1 focus:ring-violet-500/20 transition-all duration-200" />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Save button -->
                <div class="flex items-center justify-between pt-2">
                  <p v-if="saveMessage" class="text-xs" :class="saveSuccess ? 'text-emerald-400' : 'text-red-400'">{{ saveMessage }}</p>
                  <div class="ml-auto">
                    <button
                      type="submit"
                      :disabled="saving"
                      class="relative inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 12 0 12 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                      {{ saving ? 'Saving...' : 'Save Changes' }}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </template>

          <!-- ── TAB: ORGANIZER INFO ── -->
          <template v-if="activeTab === 'organizer'">
            <div class="rounded-2xl border border-white/8 bg-gray-900/60 backdrop-blur-xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              <div class="flex items-center justify-between mb-6">
                <div>
                  <h2 class="text-lg font-black text-white">Organizer Details</h2>
                  <p class="text-xs text-gray-600 mt-0.5">Information displayed on your events</p>
                </div>
                <div class="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/15">
                  <svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
              </div>

              <div class="space-y-5">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Organization Name</label>
                    <input v-model="orgForm.org_name" type="text" placeholder="EventHub Inc."
                      class="w-full px-4 py-3 rounded-xl bg-white/3 border border-white/8 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-indigo-500/50 focus:bg-white/5 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Organization Type</label>
                    <select v-model="orgForm.org_type"
                      class="w-full px-4 py-3 rounded-xl bg-gray-900/80 border border-white/8 text-gray-300 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200 cursor-pointer">
                      <option value="" class="bg-gray-900">Select type</option>
                      <option value="individual" class="bg-gray-900">Individual</option>
                      <option value="company" class="bg-gray-900">Company</option>
                      <option value="ngo" class="bg-gray-900">NGO / Non-Profit</option>
                      <option value="government" class="bg-gray-900">Government</option>
                      <option value="educational" class="bg-gray-900">Educational</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Organization Description</label>
                  <textarea v-model="orgForm.org_description" rows="3" placeholder="Describe your organization or what kind of events you run..."
                    class="w-full px-4 py-3 rounded-xl bg-white/3 border border-white/8 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-indigo-500/50 focus:bg-white/5 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200 resize-none"></textarea>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Business Email</label>
                    <input v-model="orgForm.business_email" type="email" placeholder="contact@company.com"
                      class="w-full px-4 py-3 rounded-xl bg-white/3 border border-white/8 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-indigo-500/50 focus:bg-white/5 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Business Phone</label>
                    <input v-model="orgForm.business_phone" type="tel" placeholder="+1 (555) 000-0000"
                      class="w-full px-4 py-3 rounded-xl bg-white/3 border border-white/8 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-indigo-500/50 focus:bg-white/5 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200" />
                  </div>
                </div>

                <!-- Verification badge area -->
                <div class="flex items-center gap-3 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                  <div class="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-white">Verification Status</p>
                    <p class="text-xs text-gray-500">Your organizer account is <span class="text-amber-400 font-medium">pending verification</span>. Submit your documents to get verified.</p>
                  </div>
                  <button class="ml-auto text-xs font-semibold text-indigo-400 hover:text-indigo-300 whitespace-nowrap border border-indigo-500/20 rounded-lg px-3 py-1.5 hover:bg-indigo-500/10 transition-all duration-200">
                    Submit Docs
                  </button>
                </div>

                <div class="flex justify-end">
                  <button @click="saveOrgInfo"
                    class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] transition-all duration-300 hover:scale-[1.02]">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                    Save Organizer Info
                  </button>
                </div>
              </div>
            </div>
          </template>

          <!-- ── TAB: SECURITY ── -->
          <template v-if="activeTab === 'security'">
            <!-- Change password -->
            <div class="rounded-2xl border border-white/8 bg-gray-900/60 backdrop-blur-xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              <div class="flex items-center justify-between mb-6">
                <div>
                  <h2 class="text-lg font-black text-white">Change Password</h2>
                  <p class="text-xs text-gray-600 mt-0.5">Keep your account secure</p>
                </div>
                <div class="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/15">
                  <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
              </div>

              <form @submit.prevent="changePassword" class="space-y-4">
                <div>
                  <label class="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Current Password</label>
                  <div class="relative">
                    <input
                      v-model="passwordForm.currentPassword"
                      :type="showPasswords.current ? 'text' : 'password'"
                      placeholder="••••••••"
                      class="w-full px-4 pr-11 py-3 rounded-xl bg-white/3 border border-white/8 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-emerald-500/50 focus:bg-white/5 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-200"
                    />
                    <button type="button" @click="showPasswords.current = !showPasswords.current"
                      class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="!showPasswords.current" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path v-if="!showPasswords.current" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        <path v-if="showPasswords.current" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">New Password</label>
                    <div class="relative">
                      <input
                        v-model="passwordForm.newPassword"
                        :type="showPasswords.new ? 'text' : 'password'"
                        placeholder="••••••••"
                        class="w-full px-4 pr-11 py-3 rounded-xl bg-white/3 border border-white/8 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-emerald-500/50 focus:bg-white/5 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-200"
                      />
                      <button type="button" @click="showPasswords.new = !showPasswords.new"
                        class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path v-if="!showPasswords.new" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path v-if="!showPasswords.new" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          <path v-if="showPasswords.new" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Confirm Password</label>
                    <div class="relative">
                      <input
                        v-model="passwordForm.confirmPassword"
                        :type="showPasswords.confirm ? 'text' : 'password'"
                        placeholder="••••••••"
                        class="w-full px-4 pr-11 py-3 rounded-xl bg-white/3 border border-white/8 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-emerald-500/50 focus:bg-white/5 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-200"
                        :class="{ 'border-red-500/50': passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword }"
                      />
                      <button type="button" @click="showPasswords.confirm = !showPasswords.confirm"
                        class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path v-if="!showPasswords.confirm" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path v-if="!showPasswords.confirm" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          <path v-if="showPasswords.confirm" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      </button>
                    </div>
                    <p v-if="passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword"
                      class="text-xs text-red-400 mt-1">Passwords do not match</p>
                  </div>
                </div>

                <!-- Strength indicator -->
                <div v-if="passwordForm.newPassword">
                  <div class="flex gap-1 mb-1">
                    <div v-for="i in 4" :key="i" class="flex-1 h-1 rounded-full transition-all duration-300"
                      :class="i <= passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-white/5'"></div>
                  </div>
                  <p class="text-xs" :class="strengthTextColors[passwordStrength - 1]">{{ strengthLabels[passwordStrength - 1] }}</p>
                </div>

                <div class="flex justify-end">
                  <button type="submit" :disabled="changingPassword"
                    class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-[0_0_30px_rgba(16,185,129,0.25)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all duration-300 hover:scale-[1.02] disabled:opacity-50">
                    <svg v-if="!changingPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    {{ changingPassword ? 'Updating...' : 'Update Password' }}
                  </button>
                </div>
              </form>
            </div>

            <!-- 2FA -->
            <div class="rounded-2xl border border-white/8 bg-gray-900/60 backdrop-blur-xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center border border-sky-500/15">
                    <svg class="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <h3 class="text-sm font-bold text-white">Two-Factor Authentication</h3>
                    <p class="text-xs text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                </div>
                <button class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 focus:outline-none"
                  :class="twoFactorEnabled ? 'bg-violet-600' : 'bg-white/10'"
                  @click="twoFactorEnabled = !twoFactorEnabled">
                  <span class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-300"
                    :class="twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'"></span>
                </button>
              </div>
            </div>

            <!-- Active sessions -->
            <div class="rounded-2xl border border-white/8 bg-gray-900/60 backdrop-blur-xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              <h3 class="text-lg font-black text-white mb-5">Active Sessions</h3>
              <div class="space-y-3">
                <div v-for="session in activeSessions" :key="session.id"
                  class="flex items-center justify-between p-3 rounded-xl bg-white/2 border border-white/5 hover:bg-white/4 transition-colors duration-200">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl flex items-center justify-center" :class="session.current ? 'bg-violet-500/15 border border-violet-500/15' : 'bg-white/5'">
                      <svg class="w-4 h-4" :class="session.current ? 'text-violet-400' : 'text-gray-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="session.icon" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-xs font-semibold text-white">{{ session.device }}</p>
                      <p class="text-[10px] text-gray-600">{{ session.location }} · {{ session.time }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <span v-if="session.current" class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-violet-500/15 text-violet-300 border border-violet-500/15 uppercase tracking-wider">Current</span>
                    <button v-else class="text-[10px] text-red-400 hover:text-red-300 font-medium border border-red-500/15 rounded-lg px-2 py-1 hover:bg-red-500/10 transition-all duration-200">Revoke</button>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- ── TAB: NOTIFICATIONS ── -->
          <template v-if="activeTab === 'notifications'">
            <div class="rounded-2xl border border-white/8 bg-gray-900/60 backdrop-blur-xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              <div class="flex items-center justify-between mb-6">
                <div>
                  <h2 class="text-lg font-black text-white">Notification Preferences</h2>
                  <p class="text-xs text-gray-600 mt-0.5">Control how and when we contact you</p>
                </div>
              </div>

              <div class="space-y-1">
                <div v-for="(notif, idx) in notifications" :key="idx"
                  class="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="notif.bg">
                      <svg class="w-4 h-4" :class="notif.color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="notif.icon" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm font-semibold text-white">{{ notif.label }}</p>
                      <p class="text-xs text-gray-600">{{ notif.description }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <button class="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300"
                      :class="notif.email ? 'bg-violet-600' : 'bg-white/10'"
                      @click="notif.email = !notif.email">
                      <span class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200"
                        :class="notif.email ? 'translate-x-4' : 'translate-x-0'"></span>
                    </button>
                  </div>
                </div>
              </div>

              <div class="flex justify-end mt-4">
                <button class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all duration-300 hover:scale-[1.02]">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                  Save Preferences
                </button>
              </div>
            </div>
          </template>

          <!-- ── TAB: DANGER ZONE ── -->
          <template v-if="activeTab === 'danger'">
            <div class="rounded-2xl border border-red-500/15 bg-red-950/10 backdrop-blur-xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center border border-red-500/15">
                  <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <div>
                  <h2 class="text-lg font-black text-red-400">Danger Zone</h2>
                  <p class="text-xs text-gray-600">These actions are permanent and cannot be undone</p>
                </div>
              </div>

              <div class="space-y-4">
                <!-- Deactivate -->
                <div class="flex items-center justify-between p-4 rounded-xl bg-white/2 border border-white/5">
                  <div>
                    <p class="text-sm font-semibold text-white">Deactivate Account</p>
                    <p class="text-xs text-gray-600 mt-0.5">Temporarily disable your account. You can reactivate it later.</p>
                  </div>
                  <button class="px-4 py-2 rounded-xl text-xs font-bold text-amber-400 border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/15 transition-all duration-200 whitespace-nowrap ml-4">
                    Deactivate
                  </button>
                </div>

                <!-- Export data -->
                <div class="flex items-center justify-between p-4 rounded-xl bg-white/2 border border-white/5">
                  <div>
                    <p class="text-sm font-semibold text-white">Export Your Data</p>
                    <p class="text-xs text-gray-600 mt-0.5">Download a copy of all your data in JSON format.</p>
                  </div>
                  <button class="px-4 py-2 rounded-xl text-xs font-bold text-sky-400 border border-sky-500/20 bg-sky-500/5 hover:bg-sky-500/15 transition-all duration-200 whitespace-nowrap ml-4">
                    Export
                  </button>
                </div>

                <!-- Delete account -->
                <div class="flex items-center justify-between p-4 rounded-xl bg-red-950/30 border border-red-500/15">
                  <div>
                    <p class="text-sm font-bold text-red-300">Delete Account</p>
                    <p class="text-xs text-gray-600 mt-0.5">Permanently delete your account and all associated data. This cannot be undone.</p>
                  </div>
                  <button
                    @click="deleteAccount"
                    class="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] transition-all duration-200 whitespace-nowrap ml-4">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </template>

        </div><!-- /right col -->
      </div><!-- /grid -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

const authStore = useAuthStore()

// ── State ──────────────────────────────────────────────
const activeTab = ref('personal')
const saving = ref(false)
const changingPassword = ref(false)
const saveMessage = ref('')
const saveSuccess = ref(false)
const avatarPreview = ref(null)
const avatarFile = ref(null)
const twoFactorEnabled = ref(false)

// ── Forms ──────────────────────────────────────────────
const form = ref({
  name: '', username: '', email: '', phone: '',
  dob: '', gender: '', city: '', country: '',
  bio: '', website: '', twitter: '', linkedin: '',
  avatar_url: ''
})

const orgForm = ref({
  org_name: '', org_type: '', org_description: '',
  business_email: '', business_phone: ''
})

const passwordForm = ref({ currentPassword: '', newPassword: '', confirmPassword: '' })
const showPasswords = ref({ current: false, new: false, confirm: false })

// ── Tabs ───────────────────────────────────────────────
const tabs = [
  { id: 'personal', label: 'Personal Info', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { id: 'organizer', label: 'Organizer Info', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { id: 'security', label: 'Security', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  { id: 'notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
  { id: 'danger', label: 'Danger Zone', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
]

// ── Profile stats ──────────────────────────────────────
const profileStats = ref([
  { label: 'Events Attended', value: '24', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', bg: 'bg-violet-500/10', color: 'text-violet-400' },
  { label: 'Events Created', value: '7', icon: 'M12 4v16m8-8H4', bg: 'bg-indigo-500/10', color: 'text-indigo-400' },
  { label: 'Following', value: '142', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', bg: 'bg-emerald-500/10', color: 'text-emerald-400' },
  { label: 'Member Since', value: '2024', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', bg: 'bg-sky-500/10', color: 'text-sky-400' },
])

// ── Notifications ──────────────────────────────────────
const notifications = ref([
  { label: 'New Events', description: 'When events matching your interests are published', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', bg: 'bg-violet-500/10', color: 'text-violet-400', email: true },
  { label: 'Event Reminders', description: '24 hours before events you are registered for', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', bg: 'bg-indigo-500/10', color: 'text-indigo-400', email: true },
  { label: 'Ticket Confirmation', description: 'When you successfully register for an event', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', bg: 'bg-emerald-500/10', color: 'text-emerald-400', email: true },
  { label: 'Messages', description: 'When organizers or attendees message you', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', bg: 'bg-pink-500/10', color: 'text-pink-400', email: false },
  { label: 'Marketing & Promos', description: 'Deals, promotions, and featured event picks', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z', bg: 'bg-amber-500/10', color: 'text-amber-400', email: false },
])

// ── Active sessions ────────────────────────────────────
const activeSessions = ref([
  { id: 1, device: 'Chrome on MacBook Pro', location: 'New York, US', time: 'Active now', current: true, icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { id: 2, device: 'Safari on iPhone 15', location: 'New York, US', time: '2 hours ago', current: false, icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
  { id: 3, device: 'Firefox on Windows', location: 'Boston, US', time: '3 days ago', current: false, icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
])

// ── Password strength ──────────────────────────────────
const passwordStrength = computed(() => {
  const p = passwordForm.value.newPassword
  if (!p) return 0
  let s = 0
  if (p.length >= 8) s++
  if (/[A-Z]/.test(p)) s++
  if (/[0-9]/.test(p)) s++
  if (/[^A-Za-z0-9]/.test(p)) s++
  return s
})
const strengthColors = ['bg-red-500', 'bg-amber-500', 'bg-yellow-400', 'bg-emerald-500']
const strengthTextColors = ['text-red-400', 'text-amber-400', 'text-yellow-400', 'text-emerald-400']
const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong']

// ── Role badge ─────────────────────────────────────────
const roleBadgeClass = computed(() => {
  const role = authStore.user?.role
  if (role === 'admin') return 'bg-red-500/20 text-red-300 border-red-500/20'
  if (role === 'organizer') return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/20'
  return 'bg-violet-500/20 text-violet-300 border-violet-500/20'
})

// ── Helpers ────────────────────────────────────────────
const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

// ── Avatar handlers ────────────────────────────────────
const handleAvatarChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  avatarFile.value = file
  const reader = new FileReader()
  reader.onload = (ev) => { avatarPreview.value = ev.target.result }
  reader.readAsDataURL(file)
}

const removeAvatar = () => {
  avatarPreview.value = null
  avatarFile.value = null
  form.value.avatar_url = ''
}

// ── API calls ──────────────────────────────────────────
const updateProfile = async () => {
  saving.value = true
  saveMessage.value = ''
  try {
    const { data } = await api.put('/users/profile', form.value)
    authStore.user = data.user
    saveSuccess.value = true
    saveMessage.value = 'Profile saved successfully!'
    setTimeout(() => { saveMessage.value = '' }, 3000)
  } catch (error) {
    saveSuccess.value = false
    saveMessage.value = error.response?.data?.error || 'Failed to update profile'
  } finally {
    saving.value = false
  }
}

const saveOrgInfo = async () => {
  try {
    await api.put('/users/organizer', orgForm.value)
    alert('Organizer info saved!')
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to save organizer info')
  }
}

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) return
  changingPassword.value = true
  try {
    await api.put('/users/password', {
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    })
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
    alert('Password changed successfully!')
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to change password')
  } finally {
    changingPassword.value = false
  }
}

const deleteAccount = async () => {
  if (!confirm('Are you sure you want to permanently delete your account? This cannot be undone.')) return
  try {
    await api.delete('/users/account')
    authStore.logout()
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to delete account')
  }
}

// ── Mount ──────────────────────────────────────────────
onMounted(() => {
  if (authStore.user) {
    form.value = {
      name: authStore.user.name || '',
      username: authStore.user.username || '',
      email: authStore.user.email || '',
      phone: authStore.user.phone || '',
      dob: authStore.user.dob || '',
      gender: authStore.user.gender || '',
      city: authStore.user.city || '',
      country: authStore.user.country || '',
      bio: authStore.user.bio || '',
      website: authStore.user.website || '',
      twitter: authStore.user.twitter || '',
      linkedin: authStore.user.linkedin || '',
      avatar_url: authStore.user.avatar_url || ''
    }
  }
})
</script>

<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(0.5);
  cursor: pointer;
}
select option {
  background-color: #111827;
}
</style>