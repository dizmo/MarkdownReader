import os, shutil

dizmo = __import__('grace-dizmo.plugin')
DizmoPlugin = getattr (dizmo.plugin, 'Dizmo')

class ExtendedDizmoPlugin (DizmoPlugin):
    """
    A small extension to the standard grace-dizmo plugin: In addition to the
    files copied by the standard plugin it also copies a `settings.json` JSON
    configuration into to the `build_path`, from where the dizmo can access it.
    """
    def after_build (self):
        DizmoPlugin.after_build (self)

        source = os.path.join (os.getcwd (), 'settings.json')
        target = os.path.join (self._config['build_path'], 'settings.json')

        if os.path.isfile (source):
            try:
                shutil.copy (source, target)
            except:
                print ('Could not copy your settings.json file.')

locals ()['Extended-Dizmo'] = ExtendedDizmoPlugin
