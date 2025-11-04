'use client';

import { useState, useEffect } from 'react';
import {
  Github,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Upload,
  Download,
  Plus,
  Settings,
  Eye,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  Users,
  Star,
  GitFork,
  Lock,
  Unlock,
  RefreshCw
} from 'lucide-react';
import { WitchcraftButton } from '@/components/ui/WitchcraftButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export interface GitHubRepository {
  id: string;
  name: string;
  fullName: string;
  description?: string;
  private: boolean;
  language?: string;
  stargazersCount: number;
  forksCount: number;
  updatedAt: Date;
  url: string;
  defaultBranch: string;
}

export interface GitHubCommit {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: Date;
  };
  url: string;
  branch: string;
  status: 'pending' | 'success' | 'error';
}

export interface GitHubFile {
  path: string;
  content: string;
  sha?: string;
  type: 'added' | 'modified' | 'deleted';
}

export interface GitHubConnection {
  accessToken?: string;
  username?: string;
  scopes: string[];
  isConnected: boolean;
  lastConnected?: Date;
}

interface GitHubIntegrationProps {
  projectId: string;
  files: Array<{ id: string; name: string; content: string; path: string }>;
  onCommitComplete: (commit: GitHubCommit) => void;
  className?: string;
}

export function GitHubIntegration({ projectId, files, onCommitComplete, className = '' }: GitHubIntegrationProps) {
  const [connection, setConnection] = useState<GitHubConnection>({
    isConnected: false,
    scopes: []
  });
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>('');
  const [commitMessage, setCommitMessage] = useState('');
  const [branchName, setBranchName] = useState('main');
  const [newBranchName, setNewBranchName] = useState('');
  const [isCreatingBranch, setIsCreatingBranch] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [isCloning, setIsCloning] = useState(false);
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [stagedFiles, setStagedFiles] = useState<GitHubFile[]>([]);
  const [isCreatingRepo, setIsCreatingRepo] = useState(false);
  const [newRepoName, setNewRepoName] = useState('');

  useEffect(() => {
    loadGitHubConnection();
    loadRepositories();
  }, []);

  const loadGitHubConnection = () => {
    // Simulate checking existing connection
    const storedConnection = localStorage.getItem('github_connection');
    if (storedConnection) {
      setConnection(JSON.parse(storedConnection));
    }
  };

  const loadRepositories = async () => {
    // Simulate loading repositories
    const mockRepos: GitHubRepository[] = [
      {
        id: '1',
        name: 'flareforge-project',
        fullName: 'username/flareforge-project',
        description: 'A magical AI-powered application built with FlareForge',
        private: false,
        language: 'TypeScript',
        stargazersCount: 42,
        forksCount: 8,
        updatedAt: new Date(),
        url: 'https://github.com/username/flareforge-project',
        defaultBranch: 'main'
      },
      {
        id: '2',
        name: 'magical-app',
        fullName: 'username/magical-app',
        description: 'Enchanted web application with witchcraft theme',
        private: true,
        language: 'JavaScript',
        stargazersCount: 15,
        forksCount: 3,
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        url: 'https://github.com/user/magical-app',
        defaultBranch: 'develop'
      }
    ];

    setRepositories(mockRepos);
  };

  const connectToGitHub = () => {
    // Simulate OAuth flow
    const mockAuthUrl = 'https://github.com/login/oauth/authorize?client_id=mock_client_id&scope=repo,write:repo,read:repo';
    window.open(mockAuthUrl, 'github-auth', 'width=600,height=600');

    // Simulate successful authentication
    setTimeout(() => {
      const newConnection: GitHubConnection = {
        accessToken: 'gho_mock_token_' + Math.random().toString(36).substring(7),
        username: 'developer',
        scopes: ['repo', 'write:repo', 'read:repo'],
        isConnected: true,
        lastConnected: new Date()
      };
      setConnection(newConnection);
      localStorage.setItem('github_connection', JSON.stringify(newConnection));
    }, 2000);
  };

  const disconnectFromGitHub = () => {
    setConnection({
      isConnected: false,
      scopes: []
    });
    localStorage.removeItem('github_connection');
    setRepositories([]);
  };

  const createRepository = async () => {
    if (!newRepoName.trim()) return;

    setIsCreatingRepo(true);
    try {
      // Simulate repository creation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newRepo: GitHubRepository = {
        id: Date.now().toString(),
        name: newRepoName,
        fullName: `${connection.username}/${newRepoName}`,
        description: `Project created with FlareForge AI Studio`,
        private: false,
        language: 'TypeScript',
        stargazersCount: 0,
        forksCount: 0,
        updatedAt: new Date(),
        url: `https://github.com/${connection.username}/${newRepoName}`,
        defaultBranch: 'main'
      };

      setRepositories(prev => [newRepo, ...prev]);
      setSelectedRepo(newRepo.id);
      setNewRepoName('');
      setIsCreatingRepo(false);
    } catch (error) {
      console.error('Failed to create repository:', error);
      setIsCreatingRepo(false);
    }
  };

  const cloneRepository = async (repo: GitHubRepository) => {
    setIsCloning(true);
    try {
      // Simulate cloning
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Add mock commit
      const mockCommit: GitHubCommit = {
        sha: 'abc123def456',
        message: `Cloned repository ${repo.fullName}`,
        author: {
          name: connection.username || 'Developer',
          email: 'dev@example.com',
          date: new Date()
        },
        url: `${repo.url}/commit/abc123def456`,
        branch: repo.defaultBranch,
        status: 'success'
      };

      setCommits(prev => [mockCommit, ...prev]);
      setIsCloning(false);
    } catch (error) {
      console.error('Failed to clone repository:', error);
      setIsCloning(false);
    }
  };

  const createBranch = async () => {
    if (!newBranchName.trim() || !selectedRepo) return;

    setIsCreatingBranch(true);
    try {
      // Simulate branch creation
      await new Promise(resolve => setTimeout(resolve, 1500));

      setBranchName(newBranchName);
      setNewBranchName('');
      setIsCreatingBranch(false);
    } catch (error) {
      console.error('Failed to create branch:', error);
      setIsCreatingBranch(false);
    }
  };

  const stageFile = (file: { id: string; name: string; content: string; path: string }) => {
    const stagedFile: GitHubFile = {
      path: file.path,
      content: file.content,
      type: 'added'
    };

    setStagedFiles(prev => {
      const exists = prev.find(f => f.path === file.path);
      if (exists) {
        return prev.map(f => f.path === file.path ? stagedFile : f);
      }
      return [...prev, stagedFile];
    });
  };

  const unstageFile = (path: string) => {
    setStagedFiles(prev => prev.filter(f => f.path !== path));
  };

  const commitToGitHub = async () => {
    if (!selectedRepo || !commitMessage.trim() || stagedFiles.length === 0) return;

    setIsCommitting(true);
    try {
      // Simulate commit process
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

      const newCommit: GitHubCommit = {
        sha: 'def456abc789',
        message: commitMessage,
        author: {
          name: connection.username || 'Developer',
          email: 'dev@example.com',
          date: new Date()
        },
        url: `https://github.com/${connection.username}/${repositories.find(r => r.id === selectedRepo)?.name}/commit/def456abc789`,
        branch: branchName,
        status: 'success'
      };

      setCommits(prev => [newCommit, ...prev]);
      setStagedFiles([]);
      setCommitMessage('');
      setIsCommitting(false);
      onCommitComplete(newCommit);
    } catch (error) {
      console.error('Failed to commit:', error);
      setIsCommitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-400" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const selectedRepository = repositories.find(r => r.id === selectedRepo);

  return (
    <div className={`h-full bg-gradient-to-br from-purple-900/50 via-indigo-900/50 to-blue-900/50 ${className}`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-md border-b border-purple-500/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Github className="h-6 w-6 text-purple-400" />
                <h2 className="text-xl font-bold text-white">GitHub Integration</h2>
              </div>
              {connection.isConnected && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Connected as {connection.username}
                  </Badge>
                  <Badge variant="outline" className="text-purple-300 border-purple-400">
                    {repositories.length} repos
                  </Badge>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {connection.isConnected ? (
                <Button
                  onClick={disconnectFromGitHub}
                  variant="outline"
                  className="border-red-500/20 text-red-300 hover:bg-red-800/20"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              ) : (
                <WitchcraftButton
                  onClick={connectToGitHub}
                  spellType="enchantment"
                >
                  <Unlock className="h-4 w-4 mr-2" />
                  Connect to GitHub
                </WitchcraftButton>
              )}
            </div>
          </div>
        </div>

        {!connection.isConnected ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Github className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Connect to GitHub</h3>
              <p className="text-purple-300 mb-6">
                Connect your GitHub account to sync, version control, and collaborate on your projects
              </p>
              <WitchcraftButton
                onClick={connectToGitHub}
                spellType="enchantment"
              >
                <Github className="h-4 w-4 mr-2" />
                Connect to GitHub
              </WitchcraftButton>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex">
            {/* Repository Selection */}
            <div className="w-80 bg-black/20 border-r border-purple-500/20 p-4 overflow-auto">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-white mb-3">Repositories</h3>
                <div className="space-y-2">
                  {repositories.map(repo => (
                    <Card
                      key={repo.id}
                      className={`bg-black/40 backdrop-blur-sm border cursor-pointer transition-all ${
                        selectedRepo === repo.id
                          ? 'border-purple-400'
                          : 'border-purple-500/20 hover:border-purple-400/50'
                      }`}
                      onClick={() => setSelectedRepo(repo.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-white truncate">
                            {repo.name}
                          </h4>
                          {repo.private ? (
                            <Lock className="h-3 w-3 text-gray-400" />
                          ) : (
                            <Unlock className="h-3 w-3 text-gray-400" />
                          )}
                        </div>
                        {repo.description && (
                          <p className="text-xs text-purple-300 mb-2 line-clamp-2">
                            {repo.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-purple-400">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            <span>{repo.stargazersCount}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <GitFork className="h-3 w-3" />
                            <span>{repo.forksCount}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            <span>{repo.language}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="border-t border-purple-500/20 pt-4">
                <h3 className="text-sm font-semibold text-white mb-3">Create New Repository</h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newRepoName}
                    onChange={(e) => setNewRepoName(e.target.value)}
                    placeholder="Repository name"
                    className="w-full px-3 py-2 bg-purple-900/50 border border-purple-500/20 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-purple-400"
                  />
                  <WitchcraftButton
                    onClick={createRepository}
                    spellType="enchantment"
                    size="sm"
                    disabled={!newRepoName.trim() || isCreatingRepo}
                    className="w-full"
                  >
                    {isCreatingRepo ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Repository
                      </>
                    )}
                  </WitchcraftButton>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              {selectedRepository ? (
                <>
                  {/* Repository Actions */}
                  <div className="bg-black/20 border-b border-purple-500/20 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {selectedRepository.name}
                          </h3>
                          <p className="text-sm text-purple-300">
                            {selectedRepository.fullName}
                          </p>
                        </div>
                        <Button
                          onClick={() => cloneRepository(selectedRepository)}
                          disabled={isCloning}
                          variant="outline"
                          className="border-purple-500/20 text-purple-300 hover:bg-purple-800/20"
                        >
                          {isCloning ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Cloning...
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-2" />
                              Clone
                            </>
                          )}
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="border-purple-500/20 text-purple-300 hover:bg-purple-800/20"
                        >
                          <a href={selectedRepository.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open on GitHub
                          </a>
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-purple-300">Branch:</span>
                        <select
                          value={branchName}
                          onChange={(e) => setBranchName(e.target.value)}
                          className="px-3 py-1 bg-purple-900/50 border border-purple-500/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
                        >
                          <option value="main">main</option>
                          <option value="develop">develop</option>
                          <option value="feature">feature</option>
                        </select>
                      </div>
                    </div>

                    {/* Branch Management */}
                    <div className="flex items-center gap-2 mt-3">
                      <input
                        type="text"
                        value={newBranchName}
                        onChange={(e) => setNewBranchName(e.target.value)}
                        placeholder="Create new branch..."
                        className="flex-1 px-3 py-1 bg-purple-900/50 border border-purple-500/20 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-purple-400"
                      />
                      <WitchcraftButton
                        onClick={createBranch}
                        spellType="transmutation"
                        size="sm"
                        disabled={!newBranchName.trim() || isCreatingBranch}
                      >
                        {isCreatingBranch ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <GitBranch className="h-3 w-3 mr-1" />
                            Create Branch
                          </>
                        )}
                      </WitchcraftButton>
                    </div>
                  </div>

                  <div className="flex-1 flex">
                    {/* Staged Files */}
                    <div className="w-96 bg-black/20 border-r border-purple-500/20 p-4 overflow-auto">
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Staged Files</h3>
                        <div className="space-y-2">
                          {stagedFiles.length === 0 ? (
                            <div className="text-center text-purple-400 py-4">
                              <FileText className="h-8 w-8 mx-auto mb-2" />
                              <p className="text-sm">No files staged</p>
                            </div>
                          ) : (
                            stagedFiles.map((file, index) => (
                              <div
                                key={index}
                                className="bg-black/40 border border-purple-500/20 rounded-lg p-2"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-purple-400" />
                                    <span className="text-sm text-white truncate">
                                      {file.path}
                                    </span>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => unstageFile(file.path)}
                                    className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                                  >
                                    ×
                                  </Button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Available Files */}
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-3">Available Files</h3>
                        <div className="space-y-2">
                          {files.map(file => (
                            <div
                              key={file.id}
                              className="bg-black/40 border border-purple-500/20 rounded-lg p-2"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-purple-400" />
                                  <span className="text-sm text-white truncate">
                                    {file.path}
                                  </span>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => stageFile(file)}
                                  disabled={stagedFiles.some(f => f.path === file.path)}
                                  variant="outline"
                                  className="border-purple-500/20 text-purple-300 hover:bg-purple-800/20"
                                >
                                  {stagedFiles.some(f => f.path === file.path) ? (
                                    'Staged'
                                  ) : (
                                    'Stage'
                                  )}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Commit Area */}
                      <div className="mt-4 pt-4 border-t border-purple-500/20">
                        <textarea
                          value={commitMessage}
                          onChange={(e) => setCommitMessage(e.target.value)}
                          placeholder="Commit message..."
                          className="w-full px-3 py-2 bg-purple-900/50 border border-purple-500/20 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 resize-none"
                          rows={3}
                        />
                        <WitchcraftButton
                          onClick={commitToGitHub}
                          spellType="enchantment"
                          className="w-full mt-2"
                          disabled={!commitMessage.trim() || stagedFiles.length === 0 || isCommitting}
                        >
                          {isCommitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Committing...
                            </>
                          ) : (
                            <>
                              <GitCommit className="h-4 w-4 mr-2" />
                              Commit to GitHub
                            </>
                          )}
                        </WitchcraftButton>
                      </div>
                    </div>

                    {/* Commit History */}
                    <div className="flex-1 p-4 overflow-auto">
                      <h3 className="text-sm font-semibold text-white mb-3">Commit History</h3>
                      {commits.length === 0 ? (
                        <div className="text-center text-purple-400 py-8">
                          <GitCommit className="h-12 w-12 mx-auto mb-4" />
                          <p>No commits yet</p>
                          <p className="text-sm">Stage files and commit to see history</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {commits.map(commit => (
                            <Card
                              key={commit.sha}
                              className="bg-black/40 backdrop-blur-sm border-purple-500/20"
                            >
                              <CardContent className="p-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start gap-3">
                                    {getStatusIcon(commit.status)}
                                    <div>
                                      <h4 className="text-sm font-medium text-white">
                                        {commit.message}
                                      </h4>
                                      <div className="flex items-center gap-2 text-xs text-purple-400 mt-1">
                                        <span>{commit.author.name}</span>
                                        <span>•</span>
                                        <span>{commit.date.toLocaleString()}</span>
                                        <span>•</span>
                                        <Badge variant="outline" className="text-purple-300 border-purple-400">
                                          {commit.branch}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                  <Button
                                    asChild
                                    size="sm"
                                    variant="ghost"
                                    className="text-purple-400 hover:text-purple-300"
                                  >
                                    <a href={commit.url} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <Github className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Select a Repository</h3>
                    <p className="text-purple-300">
                      Choose a repository from the sidebar to start managing your code
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}