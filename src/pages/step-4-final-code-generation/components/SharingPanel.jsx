import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SharingPanel = ({ projectData, generatedCode, onShare }) => {
  const [shareSettings, setShareSettings] = useState({
    isPublic: false,
    allowComments: true,
    allowForks: true,
    expiresIn: '30days',
    password: ''
  });

  const [shareLinks, setShareLinks] = useState({});
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');

  useEffect(() => {
    // Load saved sharing settings
    const savedSettings = localStorage.getItem('stepBuilderPro_shareSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setShareSettings(parsed);
      } catch (error) {
        console.error('Failed to load share settings:', error);
      }
    }

    // Load existing share links
    const savedLinks = localStorage.getItem('stepBuilderPro_shareLinks');
    if (savedLinks) {
      try {
        const parsed = JSON.parse(savedLinks);
        setShareLinks(parsed);
      } catch (error) {
        console.error('Failed to load share links:', error);
      }
    }

    // Load team members
    const savedTeam = localStorage.getItem('stepBuilderPro_teamMembers');
    if (savedTeam) {
      try {
        const parsed = JSON.parse(savedTeam);
        setTeamMembers(parsed);
      } catch (error) {
        console.error('Failed to load team members:', error);
      }
    }
  }, []);

  const generateShareLink = async (type = 'view') => {
    setIsGeneratingLink(true);
    
    try {
      // Simulate API call to generate share link
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const shareId = Math.random().toString(36).substring(2, 15);
      const baseUrl = 'https://stepbuilderpro.com/shared';
      const newLink = `${baseUrl}/${shareId}?type=${type}`;
      
      const linkData = {
        id: shareId,
        url: newLink,
        type: type,
        createdAt: new Date().toISOString(),
        settings: { ...shareSettings },
        views: 0,
        forks: 0
      };

      const updatedLinks = {
        ...shareLinks,
        [type]: linkData
      };

      setShareLinks(updatedLinks);
      localStorage.setItem('stepBuilderPro_shareLinks', JSON.stringify(updatedLinks));
      
      onShare?.(type, linkData);
    } catch (error) {
      console.error('Failed to generate share link:', error);
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // Show success message
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handleSettingChange = (setting, value) => {
    const newSettings = { ...shareSettings, [setting]: value };
    setShareSettings(newSettings);
    localStorage.setItem('stepBuilderPro_shareSettings', JSON.stringify(newSettings));
  };

  const addTeamMember = () => {
    if (newMemberEmail && !teamMembers.find(member => member.email === newMemberEmail)) {
      const newMember = {
        id: Math.random().toString(36).substring(2, 15),
        email: newMemberEmail,
        role: 'viewer',
        addedAt: new Date().toISOString(),
        status: 'pending'
      };

      const updatedTeam = [...teamMembers, newMember];
      setTeamMembers(updatedTeam);
      setNewMemberEmail('');
      localStorage.setItem('stepBuilderPro_teamMembers', JSON.stringify(updatedTeam));
    }
  };

  const removeTeamMember = (memberId) => {
    const updatedTeam = teamMembers.filter(member => member.id !== memberId);
    setTeamMembers(updatedTeam);
    localStorage.setItem('stepBuilderPro_teamMembers', JSON.stringify(updatedTeam));
  };

  const updateMemberRole = (memberId, newRole) => {
    const updatedTeam = teamMembers.map(member =>
      member.id === memberId ? { ...member, role: newRole } : member
    );
    setTeamMembers(updatedTeam);
    localStorage.setItem('stepBuilderPro_teamMembers', JSON.stringify(updatedTeam));
  };

  const shareToSocial = (platform) => {
    const shareText = `Check out my project created with Step Builder Pro!`;
    const shareUrl = shareLinks.view?.url || '';
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      reddit: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  const linkTypes = [
    { id: 'view', label: 'View Only', icon: 'Eye', description: 'Read-only access to the generated code' },
    { id: 'edit', label: 'Edit Access', icon: 'Edit', description: 'Full editing capabilities' },
    { id: 'embed', label: 'Embed Code', icon: 'Code', description: 'Embeddable widget code' }
  ];

  const socialPlatforms = [
    { id: 'twitter', label: 'Twitter', icon: 'Twitter', color: 'text-blue-500' },
    { id: 'linkedin', label: 'LinkedIn', icon: 'Linkedin', color: 'text-blue-600' },
    { id: 'facebook', label: 'Facebook', icon: 'Facebook', color: 'text-blue-800' },
    { id: 'reddit', label: 'Reddit', icon: 'MessageCircle', color: 'text-orange-500' }
  ];

  return (
    <div className="h-full bg-surface border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-surface-50">
        <div className="flex items-center space-x-2">
          <Icon name="Share2" size={16} className="text-text-secondary" />
          <span className="font-medium text-text-primary">Sharing & Collaboration</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Share Settings */}
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-3">Share Settings</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="Globe" size={14} className="text-text-muted" />
                  <span className="text-sm text-text-secondary">Make Public</span>
                </div>
                <input
                  type="checkbox"
                  checked={shareSettings.isPublic}
                  onChange={(e) => handleSettingChange('isPublic', e.target.checked)}
                  className="w-4 h-4 text-primary-600 bg-surface border-border rounded focus:ring-primary-500 focus:ring-2"
                />
              </label>

              <label className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="MessageSquare" size={14} className="text-text-muted" />
                  <span className="text-sm text-text-secondary">Allow Comments</span>
                </div>
                <input
                  type="checkbox"
                  checked={shareSettings.allowComments}
                  onChange={(e) => handleSettingChange('allowComments', e.target.checked)}
                  className="w-4 h-4 text-primary-600 bg-surface border-border rounded focus:ring-primary-500 focus:ring-2"
                />
              </label>

              <label className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="GitBranch" size={14} className="text-text-muted" />
                  <span className="text-sm text-text-secondary">Allow Forks</span>
                </div>
                <input
                  type="checkbox"
                  checked={shareSettings.allowForks}
                  onChange={(e) => handleSettingChange('allowForks', e.target.checked)}
                  className="w-4 h-4 text-primary-600 bg-surface border-border rounded focus:ring-primary-500 focus:ring-2"
                />
              </label>

              <div>
                <label className="block text-sm text-text-secondary mb-2">
                  Link Expires In
                </label>
                <select
                  value={shareSettings.expiresIn}
                  onChange={(e) => handleSettingChange('expiresIn', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-md bg-surface text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="never">Never</option>
                  <option value="1day">1 Day</option>
                  <option value="7days">7 Days</option>
                  <option value="30days">30 Days</option>
                  <option value="90days">90 Days</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-2">
                  Password Protection (Optional)
                </label>
                <Input
                  type="password"
                  value={shareSettings.password}
                  onChange={(e) => handleSettingChange('password', e.target.value)}
                  placeholder="Enter password"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Generate Share Links */}
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-3">Share Links</h3>
            <div className="space-y-3">
              {linkTypes.map((linkType) => (
                <div key={linkType.id} className="border border-border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon name={linkType.icon} size={14} className="text-text-secondary" />
                      <span className="text-sm font-medium text-text-primary">{linkType.label}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => generateShareLink(linkType.id)}
                      loading={isGeneratingLink}
                      iconName="Plus"
                      iconSize={12}
                    >
                      Generate
                    </Button>
                  </div>
                  <p className="text-xs text-text-muted mb-3">{linkType.description}</p>
                  
                  {shareLinks[linkType.id] && (
                    <div className="bg-surface-50 rounded-md p-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={shareLinks[linkType.id].url}
                          readOnly
                          className="flex-1 px-2 py-1 text-xs bg-surface border border-border rounded text-text-primary"
                        />
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => copyToClipboard(shareLinks[linkType.id].url)}
                          iconName="Copy"
                          iconSize={12}
                        />
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-text-muted">
                        <span>{shareLinks[linkType.id].views} views</span>
                        {linkType.id === 'edit' && <span>{shareLinks[linkType.id].forks} forks</span>}
                        <span>Created {new Date(shareLinks[linkType.id].createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Team Collaboration */}
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-3">Team Members</h3>
            
            {/* Add Team Member */}
            <div className="flex items-center space-x-2 mb-3">
              <Input
                type="email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="Enter email address"
                className="flex-1"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={addTeamMember}
                disabled={!newMemberEmail}
                iconName="UserPlus"
                iconSize={14}
              >
                Invite
              </Button>
            </div>

            {/* Team Member List */}
            <div className="space-y-2">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-surface-50 rounded-lg border border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-white">
                        {member.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-text-primary">{member.email}</div>
                      <div className="text-xs text-text-muted">
                        Added {new Date(member.addedAt).toLocaleDateString()} • {member.status}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <select
                      value={member.role}
                      onChange={(e) => updateMemberRole(member.id, e.target.value)}
                      className="px-2 py-1 text-xs border border-border rounded bg-surface text-text-primary"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => removeTeamMember(member.id)}
                      iconName="X"
                      iconSize={12}
                      className="text-error-600 hover:text-error-700"
                    />
                  </div>
                </div>
              ))}

              {teamMembers.length === 0 && (
                <div className="text-center py-6 text-text-muted">
                  <Icon name="Users" size={32} className="mx-auto mb-2" />
                  <p className="text-sm">No team members yet</p>
                  <p className="text-xs">Invite collaborators to work on this project</p>
                </div>
              )}
            </div>
          </div>

          {/* Social Sharing */}
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-3">Social Media</h3>
            <div className="grid grid-cols-2 gap-2">
              {socialPlatforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => shareToSocial(platform.id)}
                  disabled={!shareLinks.view}
                  className="flex items-center space-x-2 p-3 bg-surface-50 hover:bg-surface-100 border border-border rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon name={platform.icon} size={16} className={platform.color} />
                  <span className="text-sm text-text-primary">{platform.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-surface-50">
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>Total shares: {Object.keys(shareLinks).length}</span>
          <span>Team size: {teamMembers.length}</span>
        </div>
      </div>
    </div>
  );
};

export default SharingPanel;